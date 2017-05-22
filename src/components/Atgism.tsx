import { getRandomAtgism } from '../services/dataservice';
import { ATGIsmLimitedResponse } from '../models/models';
import React from 'react';
import { Card, CardProps } from './card/Card';
const { Spinner } = require('react-lightning-design-system');


export interface AtgismState {
  atgism?: ATGIsmLimitedResponse;
  loading: boolean;
  isError?: boolean;
  error?: string;
}

// <props, state>
export class Atgism extends React.Component<{}, AtgismState> {

  state: AtgismState;

    constructor(props: any) {
      super(props);
      this.state = {
        atgism: undefined,
        loading: false,
        isError: false,
      };
      this.randomAtgism = this.randomAtgism.bind(this);
    }

    public componentDidMount() {
      this.randomAtgism();
    }

    randomAtgism() {
      console.log('randomAtgism()');
      this.setState({loading: true});
      getRandomAtgism()
      .then(atgism => {
        console.log('atgism', atgism);
        this.setState({atgism, isError: false, loading: false});
      })
      .catch(err => {
        console.log(err);
        this.setState({error: 'Error obtaining random atgism :(', isError: true, loading: false});
      });
    }


    public render() {
      const cardBody: any = (
        <div>
          {this.state.atgism &&
            <article className="slds-tile">
              <h3>
                {this.state.atgism.message}
              </h3>
              <div className="slds-tile__detail slds-text-body_small">
                <p>Copyright {this.state.atgism.person}</p>
              </div>
            </article>}
      </div>
      );
      console.log('cardBody', cardBody);

      return (
        <div>
          {this.state.loading && 
            <div>
              <Spinner size="medium" type="brand" />
            </div>}
          {this.state.atgism && 
            <Card
              header="Random ATGism"
              showButton={true}
              buttonText="Get Another ATGism"
              onButtonClick={this.randomAtgism}
              cardBody={cardBody}>
            </Card>}
        </div>
      );
    }
}
