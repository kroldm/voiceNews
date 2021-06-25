import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native';
import * as Speech from 'expo-speech';
import axios from 'axios';
import { Audio } from 'expo-av';

import ConfigPicker from './ConfigPicker';

const corsUrl = 'https://api.rss2json.com/v1/api.json?rss_url=';
const apiKey = '&api_key=mi1xzkzcn9vou9wseasgsy5gi0oomaaq9oolva6c&count=100';

const israelNewsOptions = [
  {name: '', value: ''},
  {name: 'Последние Новости', value: 'https://news.israelinfo.co.il/rss/news.xml'},
  {name: 'Политика', value: 'https://news.israelinfo.co.il/rss/news_politics.xml'},
  {name: 'Экономика', value: 'https://news.israelinfo.co.il/rss/news_economy.xml'},
  {name: 'Происшествия', value: 'https://news.israelinfo.co.il/rss/news_events.xml'},
  {name: 'Право', value: 'https://news.israelinfo.co.il/rss/news_law.xml'},
  {name: 'Калейдоскоп', value: 'https://news.israelinfo.co.il/rss/news_kaleidoscope.xml'},
  {name: 'В Мире', value: 'https://news.israelinfo.co.il/rss/news_world.xml'},
  {name: 'Культура', value: 'https://news.israelinfo.co.il/rss/news_art.xml'},
  {name: 'Технологии', value: 'https://news.israelinfo.co.il/rss/news_technology.xml'},
  {name: 'Здоровье', value: 'https://news.israelinfo.co.il/rss/news_health.xml'},
];
const migNewsOptions = [
  {name: '', value: ''},
  {name: 'Все Новости', value: 'https://mignews.com/export/all_news.html'},
];
const newsSiteOptions = [
  {name: 'Израиль Инфо', value: israelNewsOptions},
  {name: 'Миг Новости', value: migNewsOptions},
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container1: {
    flexDirection: 'row',
  },
  text: {
      fontSize: 18,
      color: 'blue',
      marginBottom: 10,
  },
});

const App = () => {

  const [rss, setRss] = useState(null);
  const [site, setSite] = useState(israelNewsOptions);
  const [url, setUrl] = useState('https://news.israelinfo.co.il/rss/news.xml');
  const [loading, setLoading] = useState(false);
  const [disableSpeak, setDisableSpeak] = useState(true);
  const [disableStop, setDisableStop] = useState(true);
  const [disableNext, setDisableNext] = useState(true);
  const [disablePause, setDisablePause] = useState(true);
 
  const readRss = async () => {
    speakStop();
    setDisableSpeak(true);
    setDisableNext(true);
    setDisablePause(true);
    setDisableStop(true);
    setLoading(true);
    const {data} = await axios.get(`${corsUrl}${url}${apiKey}`);
    setRss(data);
    setLoading(false);
    setDisableSpeak(false);
    window.newCounter = 0;
  }

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/next.mp3')
    );
    await sound.playAsync();
  }

  const titleDone = () => {
    setTimeout(() => speakNewsContent(), 1000);
  }
  const contentDone = () => {
    window.newCounter += 1;
    playSound();
    setTimeout(() => speakNewsTitle(), 1000);
  }

  const voiceOption = {voice: 'ru-ru-x-ruf-local'};
  const voiceOptionTitle = {voice: 'ru-ru-x-ruf-local', onDone: titleDone};
  const voiceOptionContent = {voice: 'ru-ru-x-ruf-local', onDone: contentDone};

  const speakNewsTitle = () => {
    if (window.newCounter < rss.items.length) {
      Speech.speak(rss.items[window.newCounter].title, voiceOptionTitle);
    } else {
      Speech.speak('Это все новости.', voiceOption);
      setDisableSpeak(false);
      setDisableNext(true);
      setDisablePause(true);
      setDisableStop(true);
      window.newCounter = 0;
    }
  }
  const speakNewsContent = () => {
    Speech.speak(rss.items[window.newCounter].content, voiceOptionContent);
  }

  const speakNews = () => {
    setDisableSpeak(true);
    setDisableNext(false);
    setDisablePause(false);
    setDisableStop(false);
    speakNewsTitle();
  }

  const speakNext = () => {
    Speech.stop();
    window.newCounter += 1;
    speakNewsTitle();
  }

  const speakPause = () => {
    Speech.stop();
    setDisableSpeak(false);
    setDisableNext(true);
    setDisablePause(true);
    setDisableStop(false);
  }

  const speakStop = () => {
    Speech.stop();
    setDisableSpeak(false);
    setDisableNext(true);
    setDisablePause(true);
    setDisableStop(true);
    window.newCounter = 0;
  }

  useEffect(() => {
    if (url) {
      readRss();
    }
  }, [url]);

  return (
    <View style={styles.container}>
      <ConfigPicker callback={setSite} value={site} text='Новостной Сайт' options={newsSiteOptions} />
      <ConfigPicker callback={setUrl} value={url} text='Рубрика Новостей' options={site} />
      {loading && <ActivityIndicator size="large" color="blue" />}
      <Text style={styles.text}>{rss ? rss.items.length : 0} новостей</Text>
      <View style={styles.container1}>
        <Button onPress={speakNews} disabled={disableSpeak} title='Прослушать' />
        <Button onPress={speakNext} disabled={disableNext} title='Следущая' />
        <Button onPress={speakPause} disabled={disablePause} title='Пауза' />
        <Button onPress={speakStop} disabled={disableStop} title='Стоп' />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

export default App;

