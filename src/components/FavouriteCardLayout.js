import React from "react"
import FavouriteCard from "./FavouriteCard";
import { CardGroup } from "react-bootstrap";

class FavouriteCardLayout extends React.Component{

    constructor(){
        super();
        this.state= {
            empty:false
        }
    }
    render(){
     

        var titles = this.props.titleArray;
        var source = this.props.sourceArray;
        var images = this.props.imageArray;
        var date = this.props.dateArray;
        var id = this.props.idArray;
        var section = this.props.sectionArray;
        var urlToShare = this.props.urlToShareArray;
        var description = this.props.descriptionArray;
        var allArticles = [];
      
        for(var i=0;i<images.length;i++)
        {
            
            allArticles.push(<FavouriteCard 
                title={titles[i]}
                section={section[i]}
                source = {source[i]}
                description={description[i]}
                key={id[i]}
                date = {date[i]}
                image = {images[i]}
                urlToShare= {urlToShare[i]}  
                id={id[i]}               
                />)
            
        }

        if(this.props.empty)
    {
            return(
                <p>Empty</p>
            )
            }

        return(
            <CardGroup>
                {allArticles}
            </CardGroup>
                
                )
    }

}

export default FavouriteCardLayout