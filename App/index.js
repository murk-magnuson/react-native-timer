import React, {Component} from 'react';
import { 
    StyleSheet,
    Text, 
    View, 
    StatusBar, 
    TouchableOpacity,
    Dimensions,
    TextInput,
    Vibration
} from 'react-native';

let screen = Dimensions.get("window");

export default class App extends Component {
  state = {
    remainingSeconds: 5,
    isRunning: false,
    isPaused: false,
    selectedMinutes: "0",
    selectedSeconds: "5",
  };

  interval = null;

  // Checks if the state has newly reached 0 and if it did calls the
  //  natural end function.
  ///////////////////////////////////////////////////////////////////
  componentDidUpdate(prevProp, prevState) {
      if (this.state.remainingSeconds === 0 && prevState.remainingSeconds !== 0)
        this.Nend();
  }

  // Not entirely sure what the purpose of this is, he explained this
  //  as being necessary to avoid memory leaks.
  ////////////////////////////////////////////////////////////////////
  componentWillUnmount() {
    if (this.interval) {
        clearInterval(this.interval);
    }
  }

  // Function that begins running the timer, setting running to true 
  //  and calculating the seconds of the users inputted time.
  ///////////////////////////////////////////////////////////////////
  start = () => {
      this.setState({isRunning: true});
      this.setState({remainingSeconds: parseInt(this.state.selectedMinutes, 10) * 60 + parseInt(this.state.selectedSeconds, 10)});

      this.count();
  }

  // Method to start the interval clock. Used by both the initial start of
  //  a timer and also by the resume function.
  /////////////////////////////////////////////////////////////////////////
  count = () => {
    this.interval = setInterval(() => {
        this.setState(state =>({
            remainingSeconds: state.remainingSeconds - 1
          }));
      }, 1000);
  }

  // Stops the timer, clearing the interval and setting the paused value
  //  to true.
  ///////////////////////////////////////////////////////////////////////
  stop = () => {
      clearInterval(this.interval);
      this.interval = null;
      this.setState( {isPaused: true} )
  }

  // Resumes the timer, resetting the interval and removing the paused
  //  state value.
  /////////////////////////////////////////////////////////////////////
  resume = () => {
    this.count();
    this.setState( { isPaused: false } );
  }

  // Function that ends the timer. Is used both in the natural
  //  timer end and when the user cancels the timer.
  /////////////////////////////////////////////////////////////
  end = () => {
    this.stop();
    this.setState( { isRunning: false, isPaused: false } );
  }

  // Natural ending of timer only called when the time hits zero.
  //  Vibrates to let the user know the time has fully elapsed.
  ////////////////////////////////////////////////////////////////
  Nend = () => {
    this.end();
    Vibration.vibrate(1000);
  }

  // Renders to text inputs to take a user inputted value and
  //  sets the timer to that instead of with a picker wheel.
  ////////////////////////////////////////////////////////////
  renderSelecters = () => {
      return (
        <View style={styles.selecterContainer}>
            <TextInput style={styles.textInputs} 
                onChangeText={itemValue => {
                    this.setState( { selectedMinutes: itemValue } )
                }}
                value={this.state.selectedMinutes}
                keyboardType={'number-pad'}/>
            <Text style={styles.pickerItem}>Minutes</Text>
            <TextInput style={styles.textInputs} 
                onChangeText={itemValue => {
                    this.setState( { selectedSeconds: itemValue } )
                }}
                value={this.state.selectedSeconds}
                keyboardType={'number-pad'}/>
            <Text style={styles.pickerItem}>Seconds</Text>
        </View>
      );
  }
  
  // Function determines what should currently be displayed to the user by nested
  //  if statements. Button and pickers if not running, if running and not paused
  //  a counter and stop timer button, and if running and paused end and resume.
  ////////////////////////////////////////////////////////////////////////////////
  isPaused = () => {
    if (this.state.isRunning) {
        if (this.state.isPaused) {
            return (
                <View style={styles.pauseStyle}>
                    <TouchableOpacity onPress={this.resume} style = {[styles.button, styles.pauseButtons]}>
                        <Text style={[styles.buttonText, styles.pauseText]}>Resume</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.end} style = {[styles.button, styles.buttonStop, styles.pauseButtons]}>
                        <Text style={[styles.buttonText, styles.buttonTextStop, styles.pauseText]}>Reset</Text>
                    </TouchableOpacity>
                </View>
            );
        }  else {
            return (
                <TouchableOpacity onPress={this.stop} style = {[styles.button, styles.buttonStop]}>
                    <Text style={[styles.buttonText, styles.buttonTextStop]}>Stop</Text>
                </TouchableOpacity>
            );
        }
     
     } else {
        return (
            <TouchableOpacity onPress={this.start} style = {styles.button}>
                <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
        );
     }
  }

  render() {
    const {minutes, seconds} = getRemaining(this.state.remainingSeconds);
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content"/>
        
        {this.state.isRunning ? (
          <Text style={styles.timerText}>{`${minutes}:${seconds}`}</Text>
        ) : (
          this.renderSelecters()
        )}
        
        {this.isPaused()}
      </View>
    );
  };
}

const getRemaining = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60
    return {minutes: formatNumber(minutes),seconds: formatNumber(seconds)};
};

const formatNumber = (number) => `0${number}`.slice(-2);
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07305c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderWidth: 10,
    borderColor: "#89AAFF",
    width: screen.width / 2,
    height: screen.width / 2,
    borderRadius: screen.width / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30
  },
  buttonStop : {
      borderColor: '#FF851B'
  },
  buttonText: {
      fontSize: 45,
      color: "#89AAFF"
  },
  buttonTextStop: {
      color: '#FF851B'
  },
  timerText: {
      color: '#fff',
      fontSize: 90
  },
  pickerItem: {
      color: '#fff',
      fontSize: 20
  },
  textInputs: {
      backgroundColor: '#07305c',
      color: '#fff',
      fontSize: 20,
      width: 25,
      height: 25,
      margin: 5
    
  },
  selecterContainer: {
      flexDirection: 'row',
      alignItems: 'center'
  },
  pauseStyle: {
      flexDirection: 'row',
      alignContent: 'center'
  },
  pauseButtons: {
    width: screen.width / 3,
    height: screen.width / 3,
    margin: 5
  },
  pauseText: {
      fontSize: 25
  }
});
