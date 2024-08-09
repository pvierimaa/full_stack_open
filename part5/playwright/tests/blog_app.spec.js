const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
  const locator = await page.getByText('Log in to application')
  await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
        await page.getByTestId('username').fill('mluukkai')
        await page.getByTestId('password').fill('salainen')
        await page.getByRole('button', { name: 'login' }).click()
        await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await page.getByTestId('username').fill('mluukkai')
        await page.getByTestId('password').fill('wrong')
        await page.getByRole('button', { name: 'login' }).click()

        const errorDiv = await page.locator('.error')
        await expect(errorDiv).toContainText('wrong username or password')
    })

  }) 

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
    await page.getByTestId('username').fill('mluukkai')
    await page.getByTestId('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })    
    
    test('a new blog can be created', async ({ page }) => {
    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.getByTestId('title').fill('React patterns')
    await page.getByTestId('author').fill('Michael Chan')
    await page.getByTestId('url').fill('https://reactpatterns.com/')
    await page.getByRole('button', { name: 'create' }).click()
    await expect(page.getByTestId('blog-summary')).toContainText('Michael Chan')        
    })

    test('a blog can be liked', async ({ page }) => {
    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.getByTestId('title').fill('React patterns')
    await page.getByTestId('author').fill('Michael Chan')
    await page.getByTestId('url').fill('https://reactpatterns.com/')
    await page.getByRole('button', { name: 'create' }).click()
    await page.getByRole('button', { name: 'view' }).click()
    await expect(page.getByTestId('blog-details')).toContainText('likes 0')
    await page.getByRole('button', { name: 'like' }).click()
    await expect(page.getByTestId('blog-details')).toContainText('likes 1')
    })

    test('the user who created a blog can delete it', async ({ page }) => {
    await page.getByRole('button', { name: 'create new blog' }).click()
    
    await page.getByTestId('title').fill('React patterns')
    await page.getByTestId('author').fill('Michael Chan')
    await page.getByTestId('url').fill('https://reactpatterns.com/')
    await page.getByRole('button', { name: 'create' }).click()
    
    const blogSummary = await page.getByTestId('blog-summary')
    await expect(blogSummary).toContainText('React patterns')

    await page.getByRole('button', { name: 'view' }).click()
    
    page.on('dialog', async dialog => {
        if (dialog.type() === 'confirm') {
            await dialog.accept();
        }
    })
    
    await page.getByRole('button', { name: 'remove' }).click()
    await expect(blogSummary).not.toBeVisible()
    })

    test('only the user who created a blog sees the delete button', async ({ page, context }) => {
    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.getByTestId('title').fill('React patterns')
    await page.getByTestId('author').fill('Michael Chan')
    await page.getByTestId('url').fill('https://reactpatterns.com/')
    await page.getByRole('button', { name: 'create' }).click()
    
    const blogSummary = await page.getByTestId('blog-summary')
    await expect(blogSummary).toContainText('React patterns')
    await page.getByRole('button', { name: 'view' }).click()
   
    const deleteButton = page.getByRole('button', { name: 'remove' })
    await expect(deleteButton).toBeVisible()
    
    await page.getByRole('button', { name: 'logout' }).click()
    
    await context.request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Another User',
        username: 'anotheruser',
        password: 'salainen2'
      }
    })
    
    await page.getByTestId('username').fill('anotheruser')
    await page.getByTestId('password').fill('salainen2')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Another User logged in')).toBeVisible()
    
    const blogSummaryAnotherUser = await page.getByTestId('blog-summary')
    await expect(blogSummaryAnotherUser).toContainText('React patterns')
    await expect(deleteButton).not.toBeVisible()
    })

    test('blogs are ordered according to likes, with the most liked blog first', async ({ page }) => {
      const createBlog = async(title, author, url) => {
        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByTestId('title').fill(title)
        await page.getByTestId('author').fill(author)
        await page.getByTestId('url').fill(url)
        await page.getByRole('button', { name: 'create' }).click()
      }
  
      await createBlog('React patterns', 'Michael Chan', 'https://reactpatterns.com/')
      await createBlog('Go To Statement Considered Harmful', 'Edsger W. Dijkstra', 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html')
      await createBlog('Canonical string reduction', 'Edsger W. Dijkstra', 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html')

      await page.waitForTimeout(200)

      const viewButtons = await page.locator('button', { hasText: 'view' })

      await viewButtons.nth(0).click()
      await viewButtons.nth(1).click()
      await viewButtons.nth(2).click()
  
      const likeButtons = await page.locator('button', { hasText: 'like' })
  
      // Like the first blog 1 time
      await likeButtons.nth(0).click()
      await page.waitForTimeout(200)

      // Like the second blog 2 times
      for (let i = 0; i < 2; i++) {
        await likeButtons.nth(1).click()
        await page.waitForTimeout(200)
      }

       // Like the first blog 1 time
       await likeButtons.nth(0).click()
       await page.waitForTimeout(200) 
          
      //Like the third blog 2 times
      for (let i = 0; i < 2; i++) {
        await likeButtons.nth(2).click()
        await page.waitForTimeout(200)
      }
  
    const blogTitles = [];
    const blogSummaryElements = await page.locator('[data-testid="blog-summary"]');
    for (let i = 0; i < await blogSummaryElements.count(); i++) {
        const summaryText = await blogSummaryElements.nth(i).innerText();
        blogTitles.push(summaryText.trim());
    }
  
      expect(blogTitles).toEqual([
        'Go To Statement Considered Harmful Edsger W. Dijkstraview',  // 3 likes
        'Canonical string reduction Edsger W. Dijkstraview',          // 2 likes
        'React patterns Michael Chanview'                       // 1 like
      ])
    })   
  })
}) 