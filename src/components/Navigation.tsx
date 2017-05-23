import React from 'react'

export interface NavigationProps {
  header: string,
  items: string[],
  activeItem: string,
  itemChanged: (newItem: string) => void,
}

export const Navigation = (props: NavigationProps) => {

  function onClick() {
    // figure out how to capture click event new active item - 
  }

  console.log('Navigation', props);

  return (
    <div>
      <div style={{width: '320px', 'backgroundColor': '#FAFAFB'}}>
        <nav className="slds-nav-vertical slds-nav-vertical_shade" aria-label="Sub page">
          <div className="slds-nav-vertical__section">
            <h2 id="entity-header" className="slds-nav-vertical__title slds-text-title_caps">{props.header}</h2>
            <ul>
              {Array.isArray(props.items) && props.items.map((item, i) => {
                return(<li key={i} className={`slds-nav-vertical__item ${props.activeItem ? 'slds-is-active' : ''}`}>
                        <a className="slds-nav-vertical__action" aria-describedby="entity-header" aria-current={props.activeItem === item ? 'page' : null}>{item}</a>
                      </li>);
              })}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  )
}


