/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{ useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const dataStore = 'https://hn.algolia.com/api/v1/search_by_date?tags=story&page';

// created custom hook to use to call set interval to update useState.
function useInterval(callback, delay){
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function change() {
      savedCallback.current();
    }
    if(delay !== null) {
      let id = setInterval(change, delay);
      return () => clearInterval(id);
    }
  },[delay])

}

const App: () => React$Node = () => {

  const [loading, setLoading] = useState(false);
  const [pageNum, setPageNum] = useState(0);
  const [storePageNum, setStorePageNum] = useState(0);
  const [posts, setPosts] = useState([]);

  const getDataStore = (num) => {
    if (loading) { 
      console.log('Wait: Already request in progress');
      return false 
    }
    setLoading(true);
    fetch(`${dataStore}=${num}`)
    .then((response) => response.json())
    .then((json) => {
      const { hits, page } = json;
      // console.log(hits, page, posts.length);
      setPosts([...posts, ...hits]);
      setStorePageNum(page);
    })
    .finally(() => setLoading(false));
  }

  const initRequest = () => {
    if(storePageNum == pageNum) {
      setPageNum(pageNum+1);
    }
    else {
      setPageNum(storePageNum+1);
    }
  }

  useEffect(() => {
    getDataStore(pageNum);
  }, [pageNum])

  useInterval(() => {
    initRequest()
  }, 10000)


  return (
    <View style={styles.container}>
      <View style={styles.heading}>
      <Text style={styles.sectionTitle}>Post Feed</Text>
      </View>
      <ScrollView
          
          style={styles.scrollView}>
            
            <FlatList
            contentContainerStyle={{
              flex: 1,
              flexDirection: 'column',
              height: '100%',
              width: '100%'
            }}
            onEndReached={initRequest}
            onEndReachedThreshold={0.5}
            initialNumToRender={20}
            data={posts}
            renderItem={({item}) => (
              <View style={styles.item}>
                <Text style={styles.text}>
                  Title : {item.title}
                </Text>
                <Text style={styles.text}>
                  URL : {item.url}
                </Text>
                <Text style={styles.text}>
                  Created At : {item.created_at}
                </Text>
                <Text style={styles.text}>
                  Auther : {item.author}
                </Text>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            
            />
          </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30
  },
  scrollView: {
    backgroundColor: Colors.lighter,
    marginTop: 10
  },
  item: {
    padding: 10
  },
  text: {
    fontSize: 15,
    color: 'black'
  },
  separator: {
    height: 0.5,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  heading: {
    marginTop: 20
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
