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

import 'jquery';
require ('bootstrap');


export interface IPodcastWebPartProps {
  description: string;
}

export default class PodcastWebPart extends BaseClientSideWebPart<IPodcastWebPartProps> {

  public render(): void {

    let CssURL = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";

    let FontUrl = "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";

    SPComponentLoader.loadCss(CssURL);

    SPComponentLoader.loadCss(FontUrl);

    this.domElement.innerHTML = `
      <div class="${ styles.podcast }">
        <div class="${ styles.container }">

          <div class="${ styles.row }">
            <div class="${ styles.column }">
            <div class="${styles.border}">

        <div class="${styles.container}">
           
        <img src="http://bsmedia.business-standard.com/_media/bs/img/article/2014-03/12/full/1394647162-9771.jpg" class="img-responsive" alt="Cinque Terre" width="150" height="100"> 
      
        </div>
        
              <p class="${ styles.subTitle }">Customize SharePoint experiences using Web Parts.</p>
              <p class="${ styles.description }">${escape(this.properties.description)}</p>
              <a href="https://aka.ms/spfx" class="${ styles.button }">
                <span class="${ styles.label }">Learn more</span>
              </a>
              </div>
            </div>
          </div>
        </div>
      </div>`;
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
