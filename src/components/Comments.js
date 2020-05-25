import React from 'react';
import commentBox from 'commentbox.io';

class Comments extends React.Component {

    componentDidMount() {

        this.removeCommentBox = commentBox('5701218894610432-proj');
    }

    componentWillUnmount() {

        this.removeCommentBox();
    }

    render() {

        return (
            <div className="commentbox m-4" id={this.props.commentBoxId}/>
        );
    }
}

export default Comments;