import React from "react"
import PropTypes from "prop-types"

class Sidebar extends React.Component {
  static propTypes = {
    taggedOps: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    onTagClick: PropTypes.func.isRequired,
    getComponent: PropTypes.func.isRequired,
    specSelectors: PropTypes.func.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,

  }

  constructor(props) {
    super(props);
    this.state = {
      isSidebarOpen: null,
    };
  }

  handleTagClick = (tag) => {
    let isShownKey = ["operations-tag", tag]
    const isOpen = !!this.state.isSidebarOpen && this.state.isSidebarOpen === tag

    const element = document.getElementById(`operations-tag-${tag}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }    
    
    if (!isOpen) {
      this.props.layoutActions.show(isShownKey, !isOpen);
    }
    this.setState({ isSidebarOpen: isOpen ? null : tag })
  }

  handleTagMethodClick = (tag, methodName) => {
    let isShownKey = ["operations", tag, methodName]

    const element = document.getElementById(`operations-${tag}-${methodName}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      this.props.layoutActions.show(isShownKey, true);
    }
  }

  render() {
    const { getComponent, specSelectors, layoutSelectors, layoutActions } = this.props
    const Collapse = getComponent("Collapse")
    const ArrowDownIcon = getComponent("ArrowDownIcon")

    const taggedOps = specSelectors.taggedOperations().toJS()
    if (taggedOps.length === 0) {
      return <h3>No operations defined in spec!</h3>
    }
    const isPublicURL = (tagObj) => {
      return tagObj?.operations?.filter(op => op.path.includes('/public')).length;
    }

    const getApiSummary = (tagOperation) => {
      return tagOperation.operation.summary ?? tagOperation.operation.operationId
    }

    const getMethodName = (method) => {
      return (method === 'post' ? method : method.substring(0, 3)).toUpperCase()
    }

    return (
      <div className="sidebar">
        <div className="menu">
          {
            Object.keys(taggedOps).filter(tag => isPublicURL(taggedOps[tag])).map((tag, idx) => {
              const isOpen = !!this.state.isSidebarOpen && this.state.isSidebarOpen === tag

              return (
                <div key={`menu-${tag}-${idx}`} className="menu-item">
                  <div className="menu-list-item" style={{ display: "flex", alignItems: 'center', gap: 5 }} onClick={() => this.handleTagClick(tag)}>
                    <ArrowDownIcon width="12" height="12" className={`arrow  ${isOpen ? '' : 'side-arrow'}`} />
                    <span
                      key={tag}
                      id={tag}
                    >
                      {tag}
                    </span>
                  </div>

                  <Collapse isOpened={isOpen}>
                    {
                      taggedOps[tag].operations.map((operation, index) => {
                        return (
                          <div key={`collapse-${tag}-${idx}-${index}`} className="sub-menu-item">
                            <div onClick={() => this.handleTagMethodClick(tag, operation.operation.operationId)} style={{ display: "flex", gap: 10, alignItems: 'center', padding: 10 }}>
                              <div className={`method-${operation.method} opblock-summary-method method-name`}>{getMethodName(operation.method)}</div>
                              <div style={{ maxWidth: '70%', wordBreak: 'break-word' }}>{getApiSummary(operation)}</div>
                            </div>
                          </div>
                        )
                      })
                    }
                  </Collapse>
                </div>

              )
            })
          }
        </div>
      </div>
    )
  }
}

export default Sidebar