import React from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css'
import CardLayout from './CardLayout';
import Loading from "./Loading"

class Sports extends React.Component{
    constructor(){
        super()
        this.state = {
          articlesArray:{},
          updated:false,
          type:true

        }
      }

    componentDidMount(){

      if(!this.props.showToggle)
      {
          this.props.changeToggleState();
      }

      if(this.props.bookmarkFilled)
      {
        this.props.changeBookmarkState();
      }

      var url;
    if(this.props.checkedState)
    {
        url = "https://nodejs-backend-273405.appspot.com/guardian-section?section=sport";
    }
    else
    {
        url = "https://nodejs-backend-273405.appspot.com/nyt-section?section=sports";
    }
    fetch(url)
        .then(response => response.json())
        .then((data) => this.setState({
            articlesArray:data,
            updated:true,
            
            })
        )  
    }
    
    render(){
        const loaded = this.state.updated;
        if(loaded)
        {
         return(
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

export default Sports