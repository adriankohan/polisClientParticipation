import React from "react";
import _ from "lodash";
// import {ReactSVGPanZoom} from 'react-svg-pan-zoom';
import * as globals from "./globals";
import graphUtil from "../util/graphUtil";

import Axes from "./graphAxes";
import Comments from "./graphComments";
import Participants from "./graphParticipants";
import Hulls from "./hull";
import BarChartForVotes from "./barChartsForGroupVotes";
import BarChart from "./barChart";

let ptptoiScaleFactor = 0.5;

class Graph extends React.Component {

  constructor(props) {
    super(props);
    this.Viewer = null;
    this.state = {
      selectedComment: null,
    };
  }

  handleCommentHover(selectedComment) {
    return () => {
      this.setState({selectedComment});
    }
  }

  handleCommentClick(selectedComment) {
    return () => {
      this.setState({selectedComment});
    }
  }

  render() {

    if (!this.props.math) {
      return null;
    }

    let tidsToShowSet = _.keyBy(this.props.tidsToShow);

    let {
      xx,
      yy,
      commentsPoints,
      xCenter,
      yCenter,
      baseClustersScaled,
      commentScaleupFactorX,
      commentScaleupFactorY,
      hulls,
    } = graphUtil(this.props.comments, this.props.math, this.props.badTids);


    let should_only_show_voted_on_comments = false;

    commentsPoints = commentsPoints.filter((c) => {
      return !should_only_show_voted_on_comments || !_.isUndefined(tidsToShowSet[c.tid]);
    });
    let commentsToShow = this.props.comments.filter((c) => {
      return !should_only_show_voted_on_comments || !_.isUndefined(tidsToShowSet[c.tid]);
    });

    let heading = (<span><p style={{fontSize: globals.primaryHeading}}> Opinion Graph </p>
      <p style={globals.paragraph}>
        This graph shows all people and all comments.
      </p>
      <p style={globals.paragraph}>
        Comments, identified by their number, are positioned more closely to comments that were voted on similarly (blue, in the correlation matrix above). Comments are positioned further away from comments that tended to be voted on differently (red, in the correlation matrix above). </p>
      <p style={globals.paragraph}>People are positioned closer to the comments on which they agreed, and further from the comments on which they disagreed. Groups of participants that tended to vote similarly across many comments (elaborated in the previous section) are identified by their similar color.
      </p></span>);

    return (
      <div style={{marginBottom: 200}}>
        {this.props.renderHeading ? heading : ""}
        <svg width="100%" height={globals.side}>

          {/* Comment https://bl.ocks.org/mbostock/7555321 */}
          <g transform={`translate(${globals.side / 2}, ${15})`}>
            <text
              style={{
                fontFamily: "Georgia",
                fontSize: 14,
                fontStyle: "italic"
              }}
              textAnchor="middle">

            </text>
          </g>
          <Axes xCenter={xCenter} yCenter={yCenter} report={this.props.report}/>
          <Hulls hulls={hulls} showOnlyGroup={this.props.showOnlyGroup} />
          <Participants points={baseClustersScaled} ptptois={this.props.ptptois} ptptoiScaleFactor={ptptoiScaleFactor}/>
          <Comments
            commentsPoints={commentsPoints}
            selectedComment={this.state.selectedComment}
            handleCommentHover={this.handleCommentHover.bind(this)}
            points={commentsPoints}
            repfulAgreeTidsByGroup={this.props.repfulAgreeTidsByGroup}
            repfulDisageeTidsByGroup={this.props.repfulDisageeTidsByGroup}
            showOnlyGroup={this.props.showOnlyGroup}
            xx={xx}
            yy={yy}
            xCenter={xCenter}
            yCenter={yCenter}
            xScaleup={commentScaleupFactorX}
            yScaleup={commentScaleupFactorY}
            formatTid={this.props.formatTid}/>
          <BarChartForVotes
            selectedComment={this.state.selectedComment}
            allComments={this.props.comments}
            groups={window.preload.firstMath["group-votes"]}
            />
        </svg>
        <div style={{
            width:"100%",
            textAlign: "left",
            padding: "20px 0px 40px 10px",
            display: "flex",
            justifyContent:"space-between",
            alignItems: "flex-start",
          }}>
          <p style={{fontSize: 36}}>
            {this.state.selectedComment ? "#" + this.state.selectedComment.tid : null}
          </p>
          <p style={{maxWidth: 300, fontSize: 14, fontFamily: "Georgia, serif", fontStyle: "italic"}}>
            {this.state.selectedComment ? this.state.selectedComment.txt : null}
          </p>
          <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <p style={{color: "black", fontWeight: 700, fontSize: 10, fontFamily: "Helvetica, sans-serif"}}>TOTAL:</p>
            <svg width={260} height={100}>
              <BarChart
                selectedComment={this.state.selectedComment}
                allComments={this.props.comments}
                groups={window.preload.firstMath["group-votes"]}
                />
            </svg>
          </div>
        </div>
        <div style={{width: "100%", padding: 10, overflowX: "scroll", overflowY: "hidden"}}>
          {commentsToShow.map((c) => { return (
            <span
              onClick={this.handleCommentClick(c)}
              style={{
                cursor: "pointer",
                margin: 5,
                padding: 5,
                backgroundColor: "rgb(240,240,240)",
                borderRadius: 3,
              }}
              key={c.tid}>
              {c.tid}
            </span>
          )})}
        </div>
      </div>
    );
  }
}

export default Graph;

          // <defs>
          //   <marker
          //     className={'helpArrow'}
          //     id={'ArrowTip'}
          //     viewBox={'0 0 14 14'}
          //     refX={'1'
          //     refY={'5'}
          //     markerWidth={'5'}
          //     markerHeight={'5'}
          //     orient={'auto'}>
          //     // "<path d='M 0 0 L 10 5 L 0 10 z' />
          //     <circle cx = {'6'} cy = {'6'} r = {'5'} />
          //   </marker>
          //   <clipPath id={"clipCircleVis2"}>
          //     <circle r={ptptOiRadius * ptptoiScaleFactor} cx={0} cy={0}/>
          //   </clipPath>
          //   <filter id={'colorMeMatrix'}>
          //     <feColorMatrix
          //       in={'SourceGraphic'}
          //       type={'matrix'}
          //       values={'0.33 0.33 0.33 0 0
          //       0.33 0.33 0.33 0 0
          //       0.33 0.33 0.33 0 0
          //       0 0 0 1 0'} />
          //   </filter>

          //   <filter id={'colorMeMatrixRed'}
          //     <feColorMatrix
          //       in={'SourceGraphic'}
          //       type={'matrix'}
          //       values={'1.00 0.60 0.60 0 0.3
          //         0.10 0.20 0.10 0 0
          //         0.10 0.10 0.20 0 0
          //         0 0 0 1 0'} />
          //   </filter>

          //   <filter id={'colorMeMatrixGreen'}>
          //     <feColorMatrix
          //       in={'SourceGraphic'}
          //       type={'matrix'}
          //       values={'0.20 0.10 0.10 0 0
          //         0.60 1.00 0.60 0 0.3
          //         0.10 0.10 0.40 0 0
          //         0 0 0 1 0'} />
          //   </filter>
          // </defs>




// {/* this.props.math["group-clusters"].map((cluster, i) => {
//   return (<text x={300} y={300}> Renzi Supporters </text>)
// }) : null */}

// componentDidMount() {
//   this.Viewer.fitToViewer();
// }
// <div>
//   <button onClick={event => this.Viewer.zoomOnViewerCenter(1.1)}>Zoom in</button>
//   <button onClick={event => this.Viewer.fitSelection(40, 40, 200, 200)}>Zoom area</button>
//   <button onClick={event => this.Viewer.fitToViewer()}>Fit</button>
// </div>

// <ReactSVGPanZoom
//   style={{outline: "1px solid black", fill: "white"}}
//   width={500} height={500} ref={Viewer => this.Viewer = Viewer}
//   onClick={event => console.log('click', event.x, event.y, event.originalEvent)}
//   onMouseMove={event => console.log('move', event.x, event.y)} >
//
// </ReactSVGPanZoom>