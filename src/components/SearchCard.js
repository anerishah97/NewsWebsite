import React from "react"
import {Card,Modal} from "react-bootstrap"
import ReactTooltip from 'react-tooltip'
import '../styles.css'
import {IoMdShare} from "react-icons/io";
import {EmailShareButton, TwitterShareButton, FacebookShareButton} from "react-share"
import {FacebookIcon, TwitterIcon, EmailIcon} from "react-share"
import { Redirect } from "react-router-dom";
import Truncate from 'react-truncate';


class SearchCard extends React.Component{

    constructor(){
        super();
        this.state = {
            "show":false,
            "redirect":false
        }
        this.handleClose = this.handleClose.bind(this);
        this.openArticle = this.openArticle.bind(this);
        this.handleShow = this.handleShow.bind(this);
    }

    handleShow(event)
    {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        this.setState({
            "show": true,
            "redirect":this.state.redirect
        },()=>{
            console.log("Callback");
            ReactTooltip.rebuild();

        });

    }

    handleClose(event){
        this.setState({
            "show": false,
            "redirect":this.state.redirect
        })
    }
   
    openArticle(event){
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        this.setState({
            "show":this.state.show,
            "redirect":true
        })
    }

    render()
    {
        var colors = {
            "business":"#0190FF",
            "technology":"#C0DA04",
            "sport":"#FFB600",
            "politics":"#0B8878",
            "world":"#7444E6",
            "other":"#5E6A6E",
            "nytFav":"#D8D8D8",
            "guardianFav":"#2A364A"
        }

        var textColors = {
            "business":"#fff",
            "technology":"#000",
            "sport":"#000",
            "politics":"#fff",
            "world":"#fff",
            "other":"#fff",
            "nytFav":"#000",
            "guardianFav":"#fff"
        }
        var sectionBackgroundStyle = {
            backgroundColor:colors.other,
            color:textColors.other
        }
        var currentSection = this.props.section;
        if(currentSection in colors)
        {
            var c = colors[currentSection]
            var textC = textColors[currentSection]
            sectionBackgroundStyle = {
                backgroundColor:c,
                color: textC
            }
        }
        var expandURL;
        if(this.props.source==="guardian"){
            expandURL = "/article?id="+this.props.id;
        }
        else{
            expandURL = "/article?webURL="+this.props.id;
        }

        if(this.state.redirect)
        {
            return(
            <Redirect push to={expandURL} />
            )
        }

        return(
            <div className="col-md-3 col-sm-12 mb-3">
            <Card className = "shadow"  onClick={this.openArticle}>

                <div>
                    <Card.Body>
                        <div>
                            <div className="mb-2">
                                <Card.Title className="text-left font-italic">
                                <Truncate  lines={2}>  {this.props.title}</Truncate>
                                <IoMdShare id="shareButtonId"
                                    className="shareButton"
                                    onClick = {this.handleShow}
                                />      
                                </Card.Title>
                                </div>
                                <Card.Img variant="top" src={this.props.image} className="img-thumbnail p-1"></Card.Img>
                        </div> 

                        <div>
                            <Card.Text className="float-left font-italic ">{this.props.date}</Card.Text>                        
                            <Card.Text className="float-right"><span style = {sectionBackgroundStyle} className ="badge text-uppercase">{this.props.section}</span></Card.Text>
                        </div>

                    </Card.Body>
                </div>

                <div onClick={event => event.stopPropagation()}>

                <Modal show={this.state.show} onHide={this.handleClose} >
                        <Modal.Header closeButton>
                        <Modal.Body ><h5>{this.props.title}</h5></Modal.Body>
                        </Modal.Header>
                        <Modal.Body>
                            <h5 className="text-center">Share via</h5>
                            <div className = "shareButtonRow">
                                <FacebookShareButton data-tip="Facebook"
                                    url= {this.props.urlToShare}
                                    hashtag ="#CSCI_571_NewsApp"
                                >
                                <FacebookIcon round={true} size={56}/>
                                </FacebookShareButton>
                                <TwitterShareButton
                                    url = {this.props.urlToShare}
                                    hashtags={["CSCI_571_NewsApp"]}
                                >
                                <TwitterIcon round={true} size={56}/>
                                </TwitterShareButton>
                                <EmailShareButton
                                    subject="#CSCI_571_NewsApp"
                                    url={this.props.urlToShare}
                                >
                                <EmailIcon round={true} size={56}/>
                                </EmailShareButton>

                            </div>
                        </Modal.Body>
                    </Modal>
                    <ReactTooltip />
                    </div>
            </Card>
            </div>
        )
    }
}

export default SearchCard