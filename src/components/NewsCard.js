import React from "react"
import {Card,Modal} from "react-bootstrap"
import TextTruncate from 'react-text-truncate'; 
import ReactTooltip from 'react-tooltip'
import '../styles.css'
import {IoMdShare} from "react-icons/io";
import {EmailShareButton, TwitterShareButton, FacebookShareButton} from "react-share"
import {FacebookIcon, TwitterIcon, EmailIcon} from "react-share"
import { Redirect } from "react-router-dom";
class NewsCard extends React.Component{

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
            <Card className = "m-3 mb-4 shadow"  onClick={this.openArticle}>               
                <Card.Body className="row newsCard"> 
                <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 ">
                <Card.Img className="img-thumbnail p-1" variant="top" src={this.props.image}>
                </Card.Img>
                </div>
                <div className="col-md-9">
                        <Card.Title className="font-italic">
                            {this.props.title}
                            <IoMdShare
                            onClick = {this.handleShow}
                         />  
                        </Card.Title>
                       


                    <Card.Text>
                        <TextTruncate
                            line={3}
                            truncateText="..."
                            text={this.props.description}
                        />

                    </Card.Text>    
                        <Card.Text className="float-left font-italic">{this.props.date}</Card.Text>                        
                        <Card.Text className="float-right"><span style = {sectionBackgroundStyle} className ="badge text-uppercase">{this.props.section}</span></Card.Text>
                </div>
                </Card.Body>
                
                <div onClick={event => event.stopPropagation()}>

                <Modal show={this.state.show} onHide={this.handleClose} >
                        <Modal.Header closeButton>
                        <Modal.Title ><h5>{this.props.title}</h5></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h5 className="text-center pt-0">Share via</h5>
                            <div className = "shareButtonRow">
                                <FacebookShareButton data-tip="Facebook"
                                    url= {this.props.urlToShare}
                                    hashtag ="#CSCI_571_NewsApp"
                                >
                                <FacebookIcon round={true}/>
                                </FacebookShareButton>

                                <TwitterShareButton
                                    url = {this.props.urlToShare}
                                    hashtags={["CSCI_571_NewsApp"]}
                                >
                                <TwitterIcon round={true}/>

                                </TwitterShareButton>
                                <EmailShareButton
                                    subject="#CSCI_571_NewsApp"
                                    url={this.props.urlToShare}
                                >
                                <EmailIcon round={true}/>
                                </EmailShareButton>

                            </div>
                        </Modal.Body>
                    </Modal>
                    <ReactTooltip />
                    </div>
            </Card>
        )
    }
}

export default NewsCard