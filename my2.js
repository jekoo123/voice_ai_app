import { React, useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import axios from "axios";
import Toolbar from "../components/toolbar";
import { useSelector, useDispatch } from "react-redux";
import { setArray1 } from "../storage/actions";
const words = [
  ['A blessing in disguise', '처음엔 나쁘게 보였던 뜻밖의 좋은 결과'],
  ['A dime a dozen', '매우 평범한'],
  ['Beat around the bush', '불편하기 때문에 정말로 하고 싶은 말은 피한다'],
  ['Better late than never', '아예 오지않는 것보다 늦게라도 도착하는 것이 낫다'],
  ['Bite the bullet', '피할 수 없는 것을 이를 악물고 하다'],
  ['Break a leg', '행운을 빈다'],
  ['Call it a day', '그만하다'],
  ['Cut somebody some slack', '너무 비판적이지 마라'],
  ['Cutting corners', '시간이나 돈을 절약하기 위해서 무엇인가를 허술하게 하다'],
  ['Easy does it', '살살하다'],
  ['Get out of hand', '감당할 수 없게 되다'],
  ['Get something out of your system', '하고 싶은 것을 해서 더 이상 원하지 않게 하다'],
  ['Get your act together', '더 열심히 하던지 아니면 그만 두다'],
  ['Give someone the benefit of the doubt', '누군가 말하는 것을 믿다'],
  ['Go back to the drawing board', '다시 시작하다'],
  ['Hang in there', '포기하지 마라'],
  ['Hit the sack', '자러 가다'],
  ["It's not rocket science", '복잡하지 않다'],
  ['Let someone off the hook', '누군가에게 무엇인가에 대한 책임을 지우지 않다'],
  ['Make a long story short', '무엇인가를 간략하게 말하다'],
  ['Miss the boat', '너무 늦다'],
  ['No pain, no gain', '원하는 것이 있다면 노력해야 한다'],
  ['On the ball', '유능하게 잘한다'],
  ["Pull someone's leg", '놀리다'],
  ['Pull yourself together', '진정하다'],
  ['So far so good', '지금까지 모든 일이 순조롭대'],
  ['Speak of the devil', '호랑이도 제말하면 온다더니!'],
  ["That's the last straw", '내 인내심이 한계에 도달했다'],
  ['The best of both worlds', '이상적인 상황'],
  ["Time flies when you're having fun", '재미있을 때는 얼마나 지났는지 알아채지 못한다'],
  ['To get bent out of shape', '화를 내다'],
  ['To make matters worse', '문제를 더 악화시키다'],
  ['Under the weather', '아프다'],
  ["We'll cross that bridge when we come to it", '그 문제에 대해서는 지금 당장 이야기하지 말자'],
  ['Wrap your head around something', '복잡한 무엇인가를 이해하다'],
  ['You can say that again', '정말 그렇다. 동의한다'],
  ['Your guess is as good as mine', '나도 잘 모르겠다'],
  ['A bird in the hand is worth two in the bush', '지금 가진 것이 나중에 가질 수도 있는 것보다 가치있다'],
  ['A penny for your thoughts', '당신이 생각하는 것을 제게 말해 주세요'],
  ['A penny saved is a penny earned', '오늘 절약하는 돈은 나중에 사용할 수 있다'],
  ['A perfect storm', '생각할 수 있는 최악의 상황'],
  ['A picture is worth 1000 words', '백번 말하는 것보다 한번 보여주는 것이 낫다'],
  ['Actions speak louder than words', '사람들이 말하는 것이 아니라, 사람들이 하는 것을 믿다'],
  ['Add insult to injury', '좋지 않은 상황을 더 악화시키다'],
  ['Barking up the wrong tree', '엉뚱한 사람을 비난하다, 잘못된 곳에서 해결책을 구하다'],
  ['Birds of a feather flock together', '비슷한 사람들끼리 친해진다(보통 부정적으로 사용됨)'],
  ['Bite off more than you can chew', '마칠 수 없는 프로젝트를 맡다'],
  ['Break the ice', '사람드을 좀 편하게 만들어 주다'],
  ['By the skin of your teeth', '아주 조금'],
  ['Comparing apples to oranges', '비교될 수 없는 두 가지를 비교하다'],
  ['Costs an arm and a leg', '매우 비싸다'],
  ['Do something at the drop of a hat', '미리 계획하지 않고 무엇인가를 하다'],
  ['Do unto others as you would have them do unto you', '사람들을 공정하게 대하다. "황금 규칙"으로도 알려져 있음'],
  ["Don't count your chickens before they hatch", '무엇인가 좋은 일이 정말로 일어나기 전에 일어났다고 의지하지 마라.'],
  ["Don't cry over spilt milk", '어떻게 할 수 없는 것에 대해서는 불평할 이유가 없다'],
  ["Don't give up your day job", '당신이 이것을 잘 하지 못한다'],
  ["Don't put all your eggs in one basket", '당신이 하고 있는 일은 너무 위험 부담이 크다'],
  ['Every cloud has a silver lining', '좋은 일은 나쁜 일 후에 온다'],
  ['Get a taste of your own medicine', '자기가 한대로 당한다(부정적)'],
  ['Give someone the cold shoulder', '누군가를 무시하다'],
  ['Go on a wild goose chase', '헛수고하다'],
  ['Good things come to those who wait', '인내하다'],
  ['He has bigger fish to fry', '그는 지금 우리가 이야기하고 있는 것보다 더 중요한 일이 있다'],
  ["He's a chip off the old block", '부전자전'],
  ['Hit the nail on the head', '정곡을 찌르다'],
  ['Ignorance is bliss', '모르는 것이 낫다'],
  ["It ain't over till the fat lady sings", '아직 끝나지 않았다'],
  ['It takes one to know one', '그렇게 말하는 너야말로 그렇다'],
  ["It's a piece of cake", '쉽다'],
  ["It's raining cats and dogs", '비가 억수로 오고 있다'],
  ['Kill two birds with one stone', '일석이조'],
  ['Let the cat out of the bag', '비밀을 누설하다'],
  ['Live and learn', '실수를 했다'],
  ['Look before you leap', '계산된 위험만 감수하다'],
  ['On thin ice', '시험중. 한 번만 더 실수하면, 문제가 있다'],
  ['Once in a blue moon', '아주 드물게'],
  ["Play devil's advocate", '반대를 위한 반대를 하다'],
  ['Put something on ice', '일을 잠시 중단하다'],
  ["Rain on someone's parade", '무엇인가를 망치다'],
  ['Saving for a rainy day', '미래를 위해서 돈을 저축하다'],
  ['Slow and steady wins the race', '빠르기 보다는 신중함이 더 중요하다'],
  ['Spill the beans', '비밀을 누설하다'],
  ['Take a rain check', '계획을 지연하다'],
  ['Take it with a grain of salt', '너무 심각하게 받아들이지 말라'],
  ['The ball is in your court', '이것은 당신의 결정이다'],
  ['The best thing since sliced bread', '정말로 좋은 발명'],
  ['The devil is in the details', '멀리서는 좋게 보이지만, 좀 더 자세히 보면 문제가 있다'],
  ['The early bird gets the worm', '먼저 도착하는 사람들이 최고의 것을 얻는다'],
  ['The elephant in the room', '커다란 문제, 사람들이 회피하는 문제'],
  ['The whole nine yards', '모든 것, 전부'],
  ['There are other fish in the sea', '이 기회를 놓쳐도 괜찮다. 다른 것이 생길 것이다.'],
  ["There's a method to his madness", '미친 것처럼 보이지만 실제로 영리하다'],
  ["There's no such thing as a free lunch", '어떤 것도 완전하게 공짜인 것은 없다'],
  ['Throw caution to the wind', '위험을 감수하다'],
  ["You can't have your cake and eat it too", '모든 것을 가질 수는 없다'],
  ["You can't judge a book by its cover", '이 사람이나 이것은 나빠 보이지만, 속은 그렇지 않다'],
  ['A little learning is a dangerous thing', '어떤 것에 대해서 완전히 알지 못하는 사람들은 위험하다'],
  ['A snowball effect', '사건들은 모멘텀을 가지며 서로 관계되어 커진다'],
  ["A snowball's chance in hell", '기회가 전혀 없다'],
  ['A stitch in time saves nine', '문제가 있으면 지금 해결하라. 시간이 지나면 더 나빠질 것이다'],
  ['A storm in a teacup', '작은 문제에 대해서 소란스럽다'],
  ['An apple a day keeps the doctor away', '사과는 건강에 좋다'],
  ['An ounce of prevention is worth a pound of cure', '작은 노력만 하면 문제를 예방할 수 있다. 나중에 해결하려고 하면 더 힘들다.'],
  ['As right as rain', '완벽하다'],
  ['Bolt from the blue', '청천벽력'],
  ['Burn bridges', '관계를 망치다'],
  ['Calm before the storm', '무엇인가 나쁜 일이 일어날 것이지만, 지금 당장은 조용하다'],
  ['Come rain or shine', '무슨 일이 있든지'],
  ['Curiosity killed the cat', '그만 물어 보아라'],
  ['Cut the mustard', '잘해라'],
  ["Don't beat a dead horse", '넘어 가자, 이 주제는 끝난 주제이다'],
  ['Every dog has his day', '모든 사람은 적어도 한 번은 기회를 얻는다'],
  ['Familiarity breeds contempt', '누군가를 더 잘 알면 알수록 그를 덜 좋아하게 된다'],
  ['Fit as a fiddle', '건강하다'],
  ['Fortune favours the bold', '위험을 감수하다'],
  ['Get a second wind', '피곤한 다음에 에너지가 더 생기다'],
  ['Get wind of something', '무엇인가 비밀인 것에 대한 뉴스를 듣다'],
  ['Go down in flames', '화려하게 실패하다'],
  ['Haste makes waste', '무엇인가를 서두르면 실수를 할 수 있다'],
  ['Have your head in the clouds', '집중하고 있지 않다'],
  ['He who laughs last laughs loudest', '마지막에 웃는 자가 최후의 승자다'],
  ["Hear something straight from the horse's mouth", '관계자로 부터 무엇인가를 듣다'],
  ["He's not playing with a full deck", '그는 멍청하다'],
  ["He's off his rocker", '그는 미쳤다'],
  ["He's sitting on the fence", '그는 결정을 할 수 없다'],
  ['It is a poor workman who blames his tools', '당신이 그 일을 할 수 없다면, 그것에 대해서 다른 사람들 탓하지 마라'],
  ['It is always darkest before the dawn', '일들이 잘 될 것이다'],
  ['It takes two to tango', '한 사람 혼자서 책임이 없다. 두 사람 모두 책임이 있다'],
  ['Jump on the bandwagon', '트렌드를 따르라, 다른 사람이 하는 것을 하라'],
  ['Know which way the wind is blowing', '상황을 이해하라(보통 부정적임)'],
  ['Leave no stone unturned', '샅샅이 봐라'],
  ['Let sleeping dogs lie', '문제를 더 이상 논의하지 마라'],
  ['Like riding a bicycle', '어떻게 하는지 결코 잊어버리지 않는 무엇인가'],
  ['Like two peas in a pod', '그들은 항상 같이 있다'],
  ['Make hay while the sun shines', '좋은 상황을 이용하다'],
  ['On cloud nine', '매우 행복하다'],
  ['Once bitten, twice shy', '전에 다친적이 있으면 더 조심한다'],
  ['Out of the frying pan and into the fire', '여우를 피해서 호랑이를 만났다'],
  ['Run like the wind', '빨리 달리다'],
  ['Shape up or ship out', '제대로 하지 않으려면 가라'],
  ['Snowed under', '바쁘다'],
  ['That ship has sailed', '너무 늦다'],
  ['The pot calling the kettle black', '숯이 검정 나무란다'],
  ['There are clouds on the horizon', '어려움이 있을 것이다'],
  ["Those who live in glass houses shouldn't throw stones", '도덕적으로 문제가 있는 사람들은 다른 사람들을 비판해서는 안된다'],
  ['Through thick and thin', '좋을 때나 나쁠 때나'],
  ['Time is money', '빨리 일해라'],
  ['Waste not, want not', '낭비하지 않으면 아쉬운 일이 없을 것이다'],
  ['We see eye to eye', '우리는 동의한다'],
  ['Weather the storm', '어려운 일을 헤쳐나가다'],
  ['Well begun is half done', '좋으 시작은 중요하다'],
  ['When it rains it pours', '모든 일이 동시에 더 나빠진다'],
  ['You can catch more flies with honey than you can with vinegar', '착하면 원하는 것을 얻을 것이다'],
  ["You can lead a horse to water, but you can't make him drink", '누군가에게 옳은 결정을 하라고 강요할 수 없다'],
  ["You can't make an omelet without breaking some eggs", '무엇을 하려면 항상 희생이 따른다'],
  
];

export default function MyScreen() {
  const [daysentence, setDaysentence] = useState(words[0]);

  let previousIndex = -1; // 이전에 출력한 행의 인덱스

  // 현재 날짜를 기준으로 다음 행을 출력하는 함수
  function printNextProverb() {
    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();

    // 다음 행의 인덱스 계산
    let nextIndex = (previousIndex + 1) % proverbs.length;

    // 날짜가 변경되면 다음 행 출력
    if (dayOfMonth === 1) {
      setDaysentence(proverbs[nextIndex]); // daysentence 상태 업데이트
      previousIndex = nextIndex; // 이전에 출력한 행의 인덱스 업데이트
    }
  }

  // 매 시간마다 printNextProverb 함수를 호출하여 날짜 변경 여부를 확인
  setInterval(printNextProverb, 1000 * 60 * 60);
    //const [daysentence, setDaysentence] = useState(words[0]);
  
    // useEffect(() => {
    // const currentDate = new Date();
    // const dayOfMonth = currentDate.getDate();

    // const randomIndex = dayOfMonth % words.length;
    // const randomSentence = words[randomIndex];

    // setDaysentence(randomSentence);
  //}, []);


  const [mySentence, setMySentence] = useState("");
  const dispatch = useDispatch();

  const data = useSelector((state) => {
    return state;
  });

  useEffect(() => {
    if (data) {
      receiveScore();
    }
    // console.log('charScreen:21', data);
  }, []);

  const receiveScore = async () => {
    try {
      const promises = data.array1.map((e) =>
        axios.post("http://192.168.62.72:5000/score", {
          input: e[0],
          input2: e[2],
        })
      );
      const results = await Promise.all(promises);
      const newArray1 = data.array1.map((item, index) => [
        ...item,
        results[index].data.grammer_score,
      ]);
      dispatch(setArray1(newArray1));
      console.log(data.array1);
      const arrayWithMaxScore = newArray1.reduce(
        (maxArray, currentArray) =>
          currentArray[currentArray.length - 1] > maxArray[maxArray.length - 1]
            ? currentArray
            : maxArray,
        [0, 0, 0]
      );
      setMySentence(arrayWithMaxScore[0]);

      console.log(
        "First element of array with max score:",mySentence
      );
      console.log(data.array1);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentsContainer}>
        <View style={styles.todayContainer}>
          <Text style={styles.title}>오늘의 표현</Text>
          <Text style={styles.todayContent}>{daysentence[0]}</Text>
          <Text style={styles.todayContent}>{daysentence[1]}</Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.title}>점수</Text>
          <View></View>
        </View>
      </View>
      <View style={styles.toolbarContainer}>
        <Toolbar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbarContainer: {
    flex: 0.1,
  },
  contentsContainer: {
    flex: 0.9,
    justifyContent: "flex-start",
    alignItems: "center",
  },

  todayContainer: {
    backgroundColor: "#FFE4AF",
    borderRadius: 10,
    marginTop: 20,
    padding: 20,
    width: 327,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: 800,
    letterSpacing: 4,
    textAlign: "center",
  },
  todayContent: {
    paddingTop: 20,
    marginBottom: 10,
    fontSize: 18,
  },
});