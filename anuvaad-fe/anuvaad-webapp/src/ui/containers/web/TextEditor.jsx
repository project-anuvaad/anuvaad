// import React from "react";
// import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import { withStyles } from "@material-ui/core";
// import Paper from "@material-ui/core/Paper";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import CKEditor from "@ckeditor/ckeditor5-react";
// import List from "@material-ui/core/List";
// import ListItem from "@material-ui/core/ListItem";
// import ListItemText from "@material-ui/core/ListItemText";
// import FetchModels from "../../../flux/actions/apis/fetchenchmarkmodel";
// import APITransport from "../../../flux/actions/apitransport/apitransport";
// import NewCorpusStyle from "../../styles/web/Newcorpus";

// class Editor1 extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { token: false, value: "", isFocus: false };
//   }

//   componentDidMount() {
//     const { APITransport } = this.props;
//     const api = new FetchModels(1573290229, 17, 1, 1);
//     APITransport(api);
//     this.setState({ showLoader: true });
//   }

//   componentDidUpdate(prevProps) {
//     if (prevProps.fetchBenchmarkModel !== this.props.fetchBenchmarkModel) {
//       this.setState({
//         sentences: this.props.fetchBenchmarkModel.data,
//         count: this.props.fetchBenchmarkModel.count
//       });
//     }
//   }

//   handleTextChange(key, event) {
//     this.setState({
//       [key]: event
//     });
//   }

//   handleSelected = (event, text, index, editor) => {
//     editor.model.change(writer => {
//       writer.insertText(text, editor.model.document.selection.getFirstPosition());
//     });
//     this.setState({ value: editor.getData(), token: false, isFocus: true });
//   };

//   handleApiCall(data) {
//     const { APITransport } = this.props;
//     const api = new FetchModels(1573290229, 17, 5, 1);
//     APITransport(api);
//     this.setState({ token: true });
//   }

//   render() {
//     return (
//       <div
//         onClick={() => {
//           this.setState({ token: false });
//         }}
//       >
//         <div
//           style={{
//             marginLeft: "12%",
//             marginTop: "5%",
//             width: "70%"
//           }}
//         >
//           <CKEditor
//             editor={ClassicEditor}
//             data={this.state.value}
//             onBlur={(event, editor) => {
//               if (this.state.isFocus) {
//                 editor.editing.view.focus();
//               }
//             }}
//             onChange={(event, editor) => {
//               editor.editing.view.focus();

//               const data = editor.getData();
//               this.handleTextChange("value", data);
//               this.setState({ editor, isFocus: false });

//               editor.editing.view.document.on("keydown", (evt, data) => {

//                 if (data.keyCode === 9) {
//                   this.handleApiCall(editor.getData());

//                   data.preventDefault();
//                   evt.stop();
//                 } else {
//                   this.setState({ token: false });
//                 }
//               });
//             }}
//           />

//           {this.state.token && (
//             <List component="nav" style={{ marginLeft: "30%", marginRight: "20%", marginTop: "-20px" }}>
//               <Paper>
//                 {this.state.sentences.map((text, index) => (
//                   <ListItem button onClick={event => this.handleSelected(event, text.source, index, this.state.editor)} key={index}>
//                     <ListItemText primary={text.source} />
//                   </ListItem>
//                 ))}
//               </Paper>
//             </List>
//           )}
//         </div>
//       </div>
//     );
//   }
// }

// const mapStateToProps = state => ({
//   user: state.login,
//   apistatus: state.apistatus,
//   fetchBenchmarkModel: state.fetchBenchmarkModel,
//   benchmarkTranslate: state.benchmarkTranslate
// });

// const mapDispatchToProps = dispatch =>
//   bindActionCreators(
//     {
//       APITransport,
//       CreateCorpus: APITransport
//     },
//     dispatch
//   );

// export default withRouter(withStyles(NewCorpusStyle)(connect(mapStateToProps, mapDispatchToProps)(Editor1)));
