import React from "react"
import {Element } from "react-scroll"
class TruncateDes extends React.Component{

    render(){
        var i;
        var type = this.props.type;
        var showMore = false;
        if(type==="expandedCard")
        {
            showMore=true;
        }
        var descriptionProp = this.props.desc + "";
        var splittedArray = descriptionProp.split(".")
        // console.log(descriptionProp);
        // console.log(splittedArray);
        var description = "";
        var minLength = 4
        for(i=0;i<Math.min(minLength, splittedArray.length);i++)
        {   if(splittedArray[i]=="")
            {
                minLength++;
                continue;
            }
            description = description + splittedArray[i] +". ";
        }
        if(showMore)
        {
            var remainingDescription = "" ;
            for(i=4;i<splittedArray.length;i++)           
            {
                remainingDescription = remainingDescription + splittedArray[i] + ". ";
            }
        }

        if(!showMore)
        {
            return(
                <div>
                    <p name ="short-description">{description}</p>
                    <Element name="element-scroll">
                    <p name="long-description" ref = {this.props.myRef}></p>
                    </Element>
                </div>
            );
        }

        else{
            return(
                <div>
                    <p name="short-description">{description}</p>
                    {/* //<p name = "long-description" ref = {this.props.myRef}>{remainingDescription}</p> */}
                    <Element name="element-scroll">
                    <p name="long-description" ref = {this.props.myRef}>{remainingDescription}</p>
                    </Element>
                </div>
            )
        }
        
    }
}

export default TruncateDes;