import React from 'react';
const { Button, Icon } = require('react-lightning-design-system');

export interface CardProps {
  header: string,
  showButton: boolean,
  buttonText?: string,
  onButtonClick?: () => void,
  cardBody: any,
  cardFooter?: any
}

// <props, state>
export class Card extends React.Component<CardProps, null> {

  constructor(props: CardProps) {
      super(props);
  }

  public render() {
    console.log('Card component');
    return (
      <article className="slds-card">
        <div className="slds-card__header slds-grid">
          <header className="slds-media slds-media_center slds-has-flexi-truncate">
            <div className="slds-media__figure">
              <Icon
                category="standard"
                size="small"
                icon="solution"
                container={"default"}
              />
            </div>
            <div className="slds-media__body">
              <h2>
                <div className="slds-card__header">
                  <span className="slds-text-heading_small">{this.props.header}</span>
                </div>
              </h2>
            </div>
          </header>
          {this.props.showButton && this.props.onButtonClick &&
            <div className="slds-no-flex">
              <Button type="brand" onClick={this.props.onButtonClick}>{this.props.buttonText}</Button>
            </div>}
        </div>
        <div className="slds-card__body slds-card__body_inner">{this.props.cardBody}</div>
        {this.props.cardFooter && <footer className="slds-card__footer">{this.props.cardFooter}</footer>}
      </article>);
  }
}



