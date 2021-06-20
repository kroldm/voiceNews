import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native';
import * as Speech from 'expo-speech';
import axios from 'axios';

const corsUrl = 'https://api.rss2json.com/v1/api.json?rss_url=';
const url = 'https://news.israelinfo.co.il/rss/news.xml';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const App = () => {

  const [rss, setRss] = useState(null);
  const [loading, setLoading] = useState(false);

  const readRss = async () => {
    setLoading(true);
    const {data} = await axios.get(`${corsUrl}${url}`);
    setRss(data);
    setLoading(false);
  }

  const speakNews = () => {
    for (let i = 0; i < rss.items.length; i++) {
      Speech.speak(rss.items[i].title, {'voice' : 'ru-ru-x-ruf-local'});
    }
    Speech.speak('А сейчас подробнее о каждой новости.', {'voice' : 'ru-ru-x-ruf-local'});
    for (let i = 0; i < rss.items.length; i++) {
      Speech.speak(rss.items[i].content, {'voice' : 'ru-ru-x-ruf-local'});
    }
  }

  const speakStop = () => {
    Speech.stop();
  }

  useEffect(() => {
    readRss();
  }, []);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="blue" />}
      <Text>{rss ? rss.items.length : 0} последних новостей</Text>
      <Button onPress={speakNews} title='старт' />
      <Button onPress={speakStop} title='стоп' />
      <StatusBar style="auto" />
    </View>
  );
}

export default App;

