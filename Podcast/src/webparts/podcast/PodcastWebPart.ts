import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from '@microsoft/sp-loader';
import styles from './PodcastWebPart.module.scss';
import * as strings from 'PodcastWebPartStrings';

import * as $ from 'jquery';
require('bootstrap');


export interface IPodcastWebPartProps {
  description: string;
}
var podcastuser;
export default class PodcastWebPart extends BaseClientSideWebPart<IPodcastWebPartProps> {

  public render(): void {

    let CssURL = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";

    let FontUrl = "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";

    SPComponentLoader.loadCss(CssURL);

    SPComponentLoader.loadCss(FontUrl);

    this.domElement.innerHTML = `
      <div class="${ styles.podcast}">       <!-- Podcast -->
        <div class="${ styles.container}">   <!-- container -->

          <div class="${ styles.row}">        <!-- row -->
            <div class="${ styles.column}">   <!-- column -->
            <div class="${styles.border}">    <!-- border-->

       
               <div class="${styles.image}">
              <img src="" class="img-responsive" id="image" alt="Cinque Terre" width="150" height="100"> 
              </div>
       
              <p class="${ styles.title}" id="Title"></p>
              <p class="${ styles.subTitle}" id="Role"></p>
              <p class="${ styles.description}" id="Description"></p>
             <div>
              <i class="fa fa-thumbs-up" id="ThumbsUp"></i>
              <i class="fa fa-comments" id="CommentsIcon"></i>
              </div>
                <span >
                <a href="" data-toggle="modal" data-target="#myModal" >Read More</a>
                <a href="https://acuvateuk.sharepoint.com/sites/TrainingDevSite/Lists/Podcast/AllItems.aspx?viewpath=%2Fsites%2FTrainingDevSite%2FLists%2FPodcast%2FAllItems.aspx">View All</a>
                </span>
                
             
              </div><!-- border-->
            </div><!-- column -->
          </div> <!-- row -->
    
      
        <!-- The Modal -->
     <div class="modal fade" id="myModal">
          <div class="modal-dialog modal-lg">
              <div class="modal-content">
            
                      <!-- Modal Header -->
                      <div class="modal-header">
                      <h4 class="modal-title"> </h4>
                      <button type="button" class="close" data-dismiss="modal">&times;</button>
                      </div>
              
                     <!-- Modal body -->
                     <div class="modal-body">


                       <div class="container-fluid">
                         <div class="row">
                            <div class="col-md-6">

                               <div class="row">

                                  <div class="col-md-6">
                                    <img src="" id="popupimage" class="img-responsive" alt="Cinque Terre" > 
                                    <p id ="popuprole"></p>
                                 </div>
                                 <div class="col-md-6 bg-danger" id= "${styles.scrollDescription}" >
                                 Description
                                      <p id = "popupdescription"></p>
                                 </div>
                               </div>
                             </div>

                             <div class="col-md-6 ml-auto col bg-success" id="${styles.scrollComments}">

                               <!-- Modal comments -->

                               <div id = "popupcomments">
                                comments
                               <section class="comment-list">
                               <!-- dynamic comments are placed here -->
                                </section>
                               </div> 
                              <!-- Modal comments -->
                            </div>
                         </div>
                       </div>
                      </div>
              
                     <!-- Modal footer -->
                     <div class="modal-footer">
                       <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                     </div>
              
                </div>
            </div>
      </div>
    <!-- Modal ends-->
        </div> <!-- container -->
      </div>   <!-- Podcast -->`;
    this.DisplayPodcast();
    this.DisplayPopUp();
    // this.DisplayComments();
    //  this.DisplayLikes();
  }




  //---------------------------method to display podacst-----------------------------//
  DisplayPodcast() {

    var Absourl = this.context.pageContext.web.absoluteUrl;

    $(document).ready(function () {
      SPFXPodcast();
      SPFXPodcastLikesCount();
      SPFXPodcastCommentsCount();
    });

    //----------function to display the main part-----------//
    function SPFXPodcast() {

      var call = $.ajax({
        url: Absourl + `/_api/web/lists/GetByTitle('SPFXPodcast')/Items?$select = Title,Role,ImageURL,Description,LikesCount&$top = 1&$orderby=Created asc`,
        type: 'GET',
        dataType: "json",
        headers: {
          Accept: "application/json;odata=verbose"
        }
      });

      call.done(function (data, textStatus, jqXHR) {
        podcastuser = data.d.results[0].Title;
        $('#image').attr("src", data.d.results[0].URL.Url);
        $('#Title').text(data.d.results[0].Title);
        $('#Role').text(data.d.results[0].Role);
        $('#Description').text((data.d.results[0].Description).substr(0, 50) + "...");


      });

      call.fail(function (jqXHR, textStatus, errorThrown) {
        var response = JSON.parse(jqXHR.responseText);
        var message = response ? response.error.message.value : textStatus;
        alert("Call failed. Error: " + message);
      });

    };

    //--------function to display the number of likes----------//
    function SPFXPodcastLikesCount() {

      var call = $.ajax({
        url: Absourl + `/_api/web/lists/GetByTitle('SPFXPodcastLikes')/Items?$expand=Author,UserLookup&$select=Author/Id,Author/Title,UserLookup/Title`,
        type: 'GET',
        dataType: "json",
        headers: {
          Accept: "application/json;odata=verbose"
        }
      });

      call.done(function (data, textStatus, jqXHR) {

        var counter = data.d.results.filter(value => value.UserLookup.Title === podcastuser).length;
        $('#ThumbsUp').text(counter + "Likes");
      });

      call.fail(function (jqXHR, textStatus, errorThrown) {
        var response = JSON.parse(jqXHR.responseText);
        var message = response ? response.error.message.value : textStatus;
        alert("Call failed. Error: " + message);
      });

    };

    //---------------------------function to display the number of comments-----------------------------//
    function SPFXPodcastCommentsCount() {


      var call = $.ajax({
        url: Absourl + `/_api/web/lists/GetByTitle('SPFXPodcastComments')/Items?$expand=Author,UserLookup&$select=Author/Id,Author/Title,UserLookup/Title`,
        type: 'GET',
        dataType: "json",
        headers: {
          Accept: "application/json;odata=verbose"
        }
      });

      call.done(function (data, textStatus, jqXHR) {
        var counter = data.d.results.filter(value => value.UserLookup.Title === podcastuser).length;
        $('#CommentsIcon').text(counter + "comment(s)");
      });

      call.fail(function (jqXHR, textStatus, errorThrown) {
        var response = JSON.parse(jqXHR.responseText);
        var message = response ? response.error.message.value : textStatus;
        alert("Call failed. Error: " + message);
      });
    };

  }

  //------------------------------------method to populate popup----------------------------------//
  DisplayPopUp() {

    var Absourl = this.context.pageContext.web.absoluteUrl;

    $(document).ready(function () {


      $('#myModal').on('show.bs.modal', function (event) {

        SPFXPodcastPopup();
        SPFXPodcastPopupComment();

      });
    });
    //----------function to display the main part-----------//
    function SPFXPodcastPopupComment() {


      var call = $.ajax({
        url: Absourl + `/_api/web/lists/GetByTitle('SPFXPodcastComments')/Items?$expand=Author&$select=Created,Comment,Author/Id,Author/Title`,
        type: 'GET',
        dataType: "json",
        headers: {
          Accept: "application/json;odata=verbose"
        }
      });

      call.done(function (data, textStatus, jqXHR) {


        $('.comment-list').empty();
        $.each(data.d.results, function (index, value) {

          $('.comment-list').append(`       
           <article class="row">
          <div class="col-md-2 col-sm-2 hidden-xs">
            <figure class="thumbnail">
              <img class="img-responsive" src="http://www.tangoflooring.ca/wp-content/uploads/2015/07/user-avatar-placeholder.png" />
              <figcaption class="text-center"> ${value.Author.Title}</figcaption>
            </figure>
          </div>
          <div class="col-md-10 col-sm-10">
            <div class="panel panel-default arrow left">
              <div class="panel-body">
                <header class="text-left">
                  <div class="comment-user"><i class="fa fa-user"></i> ${value.Author.Title}</div>
                  <time class="comment-date" datetime="16-12-2014 01:05"><i class="fa fa-clock-o"></i> ${value.Created}</time>
                </header>
                <div class="comment-post">
                  <p>
                  ${value.Comment}
                  </p>
                </div>
                <p class="text-right"><a href="#" class="btn btn-default btn-sm"><i class="fa fa-reply"></i> reply</a></p>
              </div>
            </div>
          </div>
        </article>`);

        });
      })


      call.fail(function (jqXHR, textStatus, errorThrown) {
        var response = JSON.parse(jqXHR.responseText);
        var message = response ? response.error.message.value : textStatus;
        alert("Call failed. Error: " + message);
      });

    }
    //----------function to display the main part-----------//
    function SPFXPodcastPopup() {

      var call = $.ajax({
        url: Absourl + `/_api/web/lists/GetByTitle('SPFXPodcast')/Items?$select = Title,Role,ImageURL,Description,LikesCount&$top = 1&$orderby=Created asc`,
        type: 'GET',
        dataType: "json",
        headers: {
          Accept: "application/json;odata=verbose"
        }
      });

      call.done(function (data, textStatus, jqXHR) {


        $('.modal-header').css('background', 'red');
        $('.modal-title').text(data.d.results[0].Title)
        $('.modal-body').css('background', 'green');
        $('#popuprole').text(data.d.results[0].Role);
        $('#popupdescription').text(data.d.results[0].Description);
        $('#popupimage').attr("src", data.d.results[0].URL.Url);
        $('.modal-footer').css('background', 'yellow');

      });

      call.fail(function (jqXHR, textStatus, errorThrown) {
        var response = JSON.parse(jqXHR.responseText);
        var message = response ? response.error.message.value : textStatus;
        alert("Call failed. Error: " + message);
      });


    };

  }





  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}









      //  $('#ThumbsUp').text(data.d.results[0].LikesCount + "comment(s)");

          // $('#myModal').on('show.bs.modal', function (event) {
          //   var modal = $(this)
          //   modal.find('.modal-header').css('background', 'red');
          //   modal.find('.modal-title').text(data.d.results[0].Title)
          //   modal.find('.modal-body').css('background', 'green');
          //   modal.find('#popuprole').text(data.d.results[0].Role);
          //   modal.find('#popupdescription').text(data.d.results[0].Description);
          //   modal.find('#popupimage').attr("src", data.d.results[0].URL.Url);
          //   modal.find('.modal-footer').css('background', 'yellow');


          // })


            // DisplayComments() {

  //   var Absourl = this.context.pageContext.web.absoluteUrl;


  //   $(document).ready(function () {



  //     var call = $.ajax({
  //       url: Absourl + `/_api/web/lists/GetByTitle('SPFXPodcastComments')/Items?$expand=Author&$select=Created,Comment,Author/Id,Author/Title`,   
  //       type: 'GET',
  //       dataType: "json",
  //       headers: {
  //         Accept: "application/json;odata=verbose"
  //       }
  //     });

  //     call.done(function (data, textStatus, jqXHR) {

  //       $('#myModal').on('show.bs.modal', function (event) {

  //       var modal = $(this);
  //       modal.find('.comment-list').empty();
  //         $.each(data.d.results, function (index, value) {

  //           modal.find('.comment-list').append(`       
  //            <article class="row">
  //           <div class="col-md-2 col-sm-2 hidden-xs">
  //             <figure class="thumbnail">
  //               <img class="img-responsive" src="http://www.tangoflooring.ca/wp-content/uploads/2015/07/user-avatar-placeholder.png" />
  //               <figcaption class="text-center"> ${value.Author.Title}</figcaption>
  //             </figure>
  //           </div>
  //           <div class="col-md-10 col-sm-10">
  //             <div class="panel panel-default arrow left">
  //               <div class="panel-body">
  //                 <header class="text-left">
  //                   <div class="comment-user"><i class="fa fa-user"></i> ${value.Author.Title}</div>
  //                   <time class="comment-date" datetime="16-12-2014 01:05"><i class="fa fa-clock-o"></i> ${value.Created}</time>
  //                 </header>
  //                 <div class="comment-post">
  //                   <p>
  //                   ${value.Comment}
  //                   </p>
  //                 </div>
  //                 <p class="text-right"><a href="#" class="btn btn-default btn-sm"><i class="fa fa-reply"></i> reply</a></p>
  //               </div>
  //             </div>
  //           </div>
  //         </article>`);

  //        });
  //       })
  //     });

  //     call.fail(function (jqXHR, textStatus, errorThrown) {
  //       var response = JSON.parse(jqXHR.responseText);
  //       var message = response ? response.error.message.value : textStatus;
  //       alert("Call failed. Error: " + message);
  //     });


  // });
  // }