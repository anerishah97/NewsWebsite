import React from 'react';
import '../index.css';
import Home from './Home';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import World from './World';
import Politics from './Politics';
import Business from './Business';
import Technology from './Technology';
import Sports from './Sports';
import ArticleView from './ArticleView';
import Favourites from './Favourites';
import MyNavbar from './MyNavbar'
import Search from './Search';

class App extends React.Component{

  //checkstate true => guardian
  //checkstate false => nyt
  constructor(){
    super();
      this.state = {
      checked :true,
      queryValue:'',
      showToggleButton:true,
      bookmarkFilled:false,
      updateHomeBool:false
    }
    this.handleChange = this.handleChange.bind(this);
    this.updateSearchQuery = this.updateSearchQuery.bind(this);
    this.changeBookmarkState = this.changeBookmarkState.bind(this);
    this.changeToggleState = this.changeToggleState.bind(this);
    this.updateHome = this.updateHome.bind(this);
  }

  updateHome(val){
    this.setState({
      updateHomeBool:!this.state.updateHomeBool
    })
  }

  updateSearchQuery(keyword)
  {
  //  console.log("In app and updating search query " + keyword);
    this.setState({
      queryValue:keyword
    })
  }

  handleChange(checked){
    console.log("In handlechange");
    if(checked){
      //localStorage.removeItem("source");
      localStorage.setItem("source", "guardian");
    //  console.log("its guardian");
    }
    else
    {
      localStorage.setItem("source", "nyt");

    //  console.log("its nyt");
    }
    this.setState({ checked });
   // console.log(this.state.checked);
    }

    changeBookmarkState(){
      this.setState({
        bookmarkFilled: !this.state.bookmarkFilled
      })
    }

    changeToggleState(){
      this.setState({
        showToggleButton: !this.state.showToggleButton
      })
    }

  render(){
  //  console.log("Current query is " + this.state.queryValue);
    return(
      <div>
      <Router>
      <MyNavbar
        handleChange={this.handleChange} 
        checked = {this.state.checked} 
        updateSearchQuery={this.updateSearchQuery} 
        showToggle = {this.state.showToggleButton}
        keyword = {this.state.queryValue}
        bookmarkFilled = {this.state.bookmarkFilled}
    />
      <Switch>
    <Route path="/search" component={() => <Search 
                                            keyword={this.state.queryValue}
                                            changeToggleState={this.changeToggleState}
                                            showToggle = {this.state.showToggleButton}  
                                            bookmarkFilled = {this.state.bookmarkFilled}              
                                            changeBookmarkState = {this.changeBookmarkState}
                                            updateSearchQuery = {this.updateSearchQuery}
                                            shouldIResetQuery = {this.state.updateHomeBool}
                                            updateHome = {this.updateHome}
                                            />}/>

    <Route exact path="/" component={() => <Home
                                            checkedState={this.state.checked}
                                            changeToggleState={this.changeToggleState}
                                            showToggle = {this.state.showToggleButton}
                                            bookmarkFilled = {this.state.bookmarkFilled}              
                                            changeBookmarkState = {this.changeBookmarkState}   
                                            updateSearchQuery={this.updateSearchQuery} 
                                            keyword = {this.state.queryValue}
                                            shouldIResetQuery = {this.state.updateHomeBool}
                                            updateHome = {this.updateHome}
                                            />}/>

    <Route exact path="/home" component={() => <Home 
                                                checkedState={this.state.checked}
                                                changeToggleState={this.changeToggleState}
                                                showToggle = {this.state.showToggleButton}   
                                                bookmarkFilled = {this.state.bookmarkFilled}              
                                                changeBookmarkState = {this.changeBookmarkState}       
                                                updateSearchQuery={this.updateSearchQuery} 
                                                keyword = {this.state.queryValue}
                                                shouldIResetQuery = {this.state.updateHomeBool}
                                                updateHome = {this.updateHome}
                                                />}/>


    <Route exact path="/world" component={() => <World 
                                                changeToggleState={this.changeToggleState}
                                                showToggle = {this.state.showToggleButton}
                                                checkedState={this.state.checked} 
                                                bookmarkFilled = {this.state.bookmarkFilled}              
                                                changeBookmarkState = {this.changeBookmarkState}
                                                updateSearchQuery={this.updateSearchQuery} 

                                                />}/>

    <Route exact path="/politics" component={() => <Politics 
                                                      checkedState={this.state.checked} 
                                                      changeToggleState={this.changeToggleState}
                                                      showToggle = {this.state.showToggleButton}
                                                      bookmarkFilled = {this.state.bookmarkFilled}              
                                                      changeBookmarkState = {this.changeBookmarkState}                          
                                                      />} />


    <Route exact path="/business" component={() => <Business 
                                                      checkedState={this.state.checked} 
                                                      changeToggleState={this.changeToggleState}
                                                      showToggle = {this.state.showToggleButton}
                                                      bookmarkFilled = {this.state.bookmarkFilled}              
                                                      changeBookmarkState = {this.changeBookmarkState}                          
                                                      />}/>

    <Route exact path="/technology" component={() => <Technology
                                                         checkedState={this.state.checked} 
                                                         changeToggleState={this.changeToggleState}
                                                         showToggle = {this.state.showToggleButton} 
                                                         bookmarkFilled = {this.state.bookmarkFilled}              
                                                        changeBookmarkState = {this.changeBookmarkState}                            
                                                         />}/>

    <Route exact path="/sports" component={() => <Sports 
                                                  checkedState={this.state.checked}
                                                  changeToggleState={this.changeToggleState}
                                                  showToggle = {this.state.showToggleButton}       
                                                  bookmarkFilled = {this.state.bookmarkFilled}              
                                                  changeBookmarkState = {this.changeBookmarkState}               
                                                  />}/>

    <Route exact path = "/favourites" component = {() => <Favourites 
                            localStoragelength={localStorage.length}
                            changeToggleState={this.changeToggleState}
                            showToggle = {this.state.showToggleButton}
                            bookmarkFilled = {this.state.bookmarkFilled}              
                            changeBookmarkState = {this.changeBookmarkState}
                            />}/>

    <Route path="/article" component={() => <ArticleView 
                                              checkedState={this.state.checked} 
                                              changeToggleState={this.changeToggleState}
                                              showToggle = {this.state.showToggleButton} 
                                              bookmarkFilled = {this.state.bookmarkFilled}              
                                              changeBookmarkState = {this.changeBookmarkState}  
                                              updateSearchQuery={this.updateSearchQuery} 
                                              keyword={this.state.queryValue}
                                              />}/>

    </Switch>
</Router>
</div>
    )
  }
}

export default App