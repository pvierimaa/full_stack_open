import { useState, useEffect } from 'react';
import { Diary } from './types';
import { getAllDiaries, createDiary } from './services/diaryService';
import axios from 'axios';

const App = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [newDate, setNewDate] = useState('');
  const [newVisibility, setNewVisibility] = useState('');
  const [newWeather, setNewWeather] = useState('');
  const [newComment, setNewComment] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    getAllDiaries().then((data) => {
      setDiaries(data);
    });
  }, []);

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const diaryToAdd = {
      date: newDate,
      weather: newWeather,
      visibility: newVisibility,
      comment: newComment,
    };

    createDiary(diaryToAdd)
      .then((data) => {
        setDiaries(diaries.concat(data));
        setNewDate('');
        setNewVisibility('');
        setNewWeather('');
        setNewComment('');
        setErrorMessage(null);
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          setErrorMessage(error.response?.data);
          console.error(error.response);
        } else {
          setErrorMessage('An unexpected error occurred');
          console.error(error);
        }
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  return (
    <div>
      <h1>Add new entry</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={diaryCreation}>
        <div>
          date{' '}
          <input type="date" value={newDate} onChange={(event) => setNewDate(event.target.value)} />
        </div>
        <div>
          visibility great
          <input
            type="radio"
            name="visibility"
            value="great"
            checked={newVisibility === 'great'}
            onChange={(event) => setNewVisibility(event.target.value)}
          />
          good
          <input
            type="radio"
            name="visibility"
            value="good"
            checked={newVisibility === 'good'}
            onChange={(event) => setNewVisibility(event.target.value)}
          />
          ok
          <input
            type="radio"
            name="visibility"
            value="ok"
            checked={newVisibility === 'ok'}
            onChange={(event) => setNewVisibility(event.target.value)}
          />
          poor
          <input
            type="radio"
            name="visibility"
            value="poor"
            checked={newVisibility === 'poor'}
            onChange={(event) => setNewVisibility(event.target.value)}
          />
        </div>
        <div>
          weather sunny
          <input
            type="radio"
            name="weather"
            value="sunny"
            checked={newWeather === 'sunny'}
            onChange={(event) => setNewWeather(event.target.value)}
          />
          rainy
          <input
            type="radio"
            name="weather"
            value="rainy"
            checked={newWeather === 'rainy'}
            onChange={(event) => setNewWeather(event.target.value)}
          />
          cloudy
          <input
            type="radio"
            name="weather"
            value="cloudy"
            checked={newWeather === 'cloudy'}
            onChange={(event) => setNewWeather(event.target.value)}
          />
          stormy
          <input
            type="radio"
            name="weather"
            value="stormy"
            checked={newWeather === 'stormy'}
            onChange={(event) => setNewWeather(event.target.value)}
          />
          windy
          <input
            type="radio"
            name="weather"
            value="windy"
            checked={newWeather === 'windy'}
            onChange={(event) => setNewWeather(event.target.value)}
          />
        </div>
        <div>
          comment{' '}
          <input value={newComment} onChange={(event) => setNewComment(event.target.value)} />
        </div>
        <button type="submit">add</button>
      </form>

      <h1>Diary entries</h1>
      {diaries.map((diary) => (
        <div key={diary.id}>
          <h2>{diary.date}</h2> <div>visibility: {diary.visibility}</div>
          <div>weather: {diary.weather}</div> <div>comment: {diary.comment}</div>
        </div>
      ))}
    </div>
  );
};

export default App;
