import React from 'react'
import ReactDOM from 'react-dom'
import { Atgism } from './components/Atgism';
import { Navigation, NavigationProps } from './components/Navigation';
const { Spinner, PageHeader, PageHeaderHeading, Icon } = require('react-lightning-design-system');

type AppState = {
  activeItem: string,
}

export interface NavigationProps {
  header: string,
  items: string[],
  activeItem: string,
  itemChanged: (newItem: string) => void,
}

export class App extends React.Component<{}, AppState> {

  state: AppState;
  navigationItems = ['ATGism', 'Dress Code'];

  constructor() {
      super();
      this.onNavChange = this.onNavChange.bind(this);
      this.state = {
        activeItem: '',
      };
      
  }

  onNavChange(newItem: string) {
    console.log('onNavChange()', newItem);
    this.setState({activeItem: newItem});
  }

  public render() {
    console.log('Card component', this);
    return (
      <div>
        <PageHeader>
          <PageHeaderHeading title="ATGism" info="Get your daily dose of the MSC"  />
        </PageHeader>
        <div className="slds-grid">
          <div className="slds-col">
            <div>
              <Navigation
                header = 'Navigation'
                items = {this.navigationItems}
                activeItem = 'ATGism'
                itemChanged = {this.onNavChange}
              ></Navigation>
            </div>
          </div>
          <div className="slds-col">
            <div>
              <Atgism></Atgism>
            </div>
          </div>
        </div>
      </div>
    )

  }
}

ReactDOM.render(<App />, document.getElementById('app'));