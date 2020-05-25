import React from "react"
import Loading from "./Loading"
import FavouriteCardLayout from "./FavouriteCardLayout"
import {ToastContainer} from 'react-toastify';
import ReactTooltip from "react-tooltip";

class Favourites extends React.Component{
    constructor(){
        super();
        this.state= {
            loaded:false,
            empty:false,
            listOfArticles:[],
            localStorage: localStorage.length
            
        }
    }
 
    componentDidMount(){
        ReactTooltip.hide();
        if(!this.props.bookmarkFilled)
        {
            this.props.changeBookmarkState();
        }
        

        if(this.props.showToggle)
        {
            this.props.changeToggleState();

        }
     
        if(this.props.localStoragelength == 1)
        {
            this.setState({
                empty:true
            })
        }
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            var value = localStorage.getItem(key);
            if(key=="source")
            {
                continue;
            }
            var url;
            if(value === "guardian")
            {
                url = "https://nodejs-backend-273405.appspot.com/guardian-search?id=" + key;

            }
            else{
                url = "https://nodejs-backend-273405.appspot.com/nyt-search?id=" + key;
            }
            fetch(url)
            .then(response => response.json())
            .then((data) => {
                var temp = this.state.listOfArticles;
                temp.push(data);
                this.setState({
                    listOfArticles:temp
                })
            }
            )
        }  
        this.setState({
            loaded:true
        })

    }

    

    render(){
        if(localStorage.length == 1)
        {

            return(
                <div>
                    <ToastContainer/>
                <div className="text-center h4 mt-1">You have no saved articles
                </div>
                </div>
            )
        }
       // console.log("in render");
       // console.log(this.props.localStoragelength);
        

        const load = this.state.loaded;
        var titleArray = [];
        var idArray = [];
        var sourceArray =[];
        var imageArray=[];
        var dateArray = [];
        var urlToShareArray = [];
        var descriptionArray = [];
        var sectionArray = [];
        var allArticlesFromState = this.state.listOfArticles
        // console.log("hryyyyyyyyyyyyyyyyyyyy");
        // console.log("In favourites => render ");
        // console.log(this.state.empty);
        // console.log(allArticlesFromState);
        for(var i=0;i<allArticlesFromState.length;i++)
        {
            var currentArticle = allArticlesFromState[i];
            titleArray.push(currentArticle["title"]);
            idArray.push(currentArticle["id"]);
            sourceArray.push(currentArticle["source"]);
            imageArray.push(currentArticle["image"]);
            dateArray.push(currentArticle["date"]);
            urlToShareArray.push(currentArticle["urlToShare"]);
            descriptionArray.push(currentArticle["description"]);
            sectionArray.push(currentArticle["section"])
        }

        if(load)
        {
            return(
                <div>
                    <ToastContainer/>

                    <h2 className="ml-3">Favourites</h2>
                    <FavouriteCardLayout 
                        empty = {this.state.empty}
                        titleArray = {titleArray} 
                        idArray={idArray} 
                        sourceArray={sourceArray} 
                        imageArray={imageArray}
                        dateArray={dateArray}
                        urlToShareArray={urlToShareArray}
                        descriptionArray = {descriptionArray}
                        sectionArray = {sectionArray}
                        />
                </div>
            );
        }
        else
        {
            return(
                <Loading/>
            )
        }

    }
}

export default Favourites;