import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CardLayout from './CardLayout';
import '../styles.css'
import Loading from "./Loading"

class Home extends React.Component{
//type = true for guardian 
//type = false for nytimes
  constructor(){
    super()
    this.state = {
      articlesArray:{},
      updated:false,
      type:true
    }
  }

  componentDidUpdate(){
  //   console.log(" in homes component did update");
  //   console.log(" keyword in update home before changing  " + this.props.keyword);
  //   if(this.props.keyword !=""){
  //     this.props.updateSearchQuery("");
  // }
  // console.log(" keyword in update home after changing  " + this.props.keyword);

  }

  componentDidMount(){
    var url;
  //   console.log(" in homes component did mount");

  //   var QueryValueInHome = this.props.keyword;
  //   console.log("Query value in home " + QueryValueInHome);
    
  //   console.log(" in homes component did mounth");
  //   console.log(" keyword in mount home before changing  " + this.props.keyword);
  //   if(this.props.keyword !=""){
  //     this.props.updateSearchQuery("");
  // }
  // console.log(" keyword in didmount home after changing  " + this.props.keyword);

    if(!this.props.showToggle)
    {
        this.props.changeToggleState();

    }

    if(this.props.bookmarkFilled)
    {
      this.props.changeBookmarkState();
    }
    
    if(this.props.checkedState)
    {
      url = "https://nodejs-backend-273405.appspot.com/guardian-home";
    }
    else
    {
      url = "https://nodejs-backend-273405.appspot.com/nyt-home"
    }
    fetch(url)
      .then(response => response.json())
      .then((data) => this.setState({
            articlesArray:data,
            updated:true })
       )  
    }

  render(){
    const loaded = this.state.updated;
        if(loaded)
        {
         return(
           // <p>{this.state.articlesArray.articles[0].title}</p>
            <CardLayout articleArray={this.state.articlesArray}/>
          ) 
        }
        else
        {
          return(
            <Loading/>
          )
        }
  }
}

export default Home;
