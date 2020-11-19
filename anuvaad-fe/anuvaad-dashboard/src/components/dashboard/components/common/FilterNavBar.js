import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { DashboardService } from "../../../../services/dashboard.service";
import DateFilter from "./DateFilter";
import { MultipleDash } from "../../../../services/multipleDash.service";

/* global $ */

/**
 * Filter Navbar Component
 * Holds all filters and multiple dashboards selections
 */

class FilterNavBar extends Component {
  _isMounted = false;
  container = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      dashboardConfigData: [],
      dashCount: "",
      dashboardList: [],
      searchList: [],
      searchFilterListOne: [],
      searchFilterListTwo: [],
      searchFilterListThree: [],
      showDropDownOne: false,
      showCustomFilterDD: false,
      filterUnitList: [],
      filterCountryList: [],
      filterThirdList: [],
      filterUnitName: "",
      filterCountryName: "",
      filterThirdName: "",
      selectedCountryFilter: "",
      selectedUnitFilter: "",
      selectedThirdFilter: "",
      customFilterUnitKey: [],
      customFilterCountryKey: [],
      customFilterThirdKey: []
      // showDropDownTwo: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeOne = this.handleChangeOne.bind(this);
    this.handleChangeTwo = this.handleChangeTwo.bind(this);
    this.handleChangeThree = this.handleChangeThree.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    this._isMounted = true;

    setTimeout(() => {
      let filterData = localStorage.getItem("customFilters");
      filterData = JSON.parse(filterData);
      // let name = filterData[0].values;
      if (filterData && filterData[0] !== undefined) {
        if (filterData.length === 3) {
          this.setState(
            {
              filterUnitName: filterData[0].name,
              filterCountryName: filterData[1].name,
              filterThirdName: filterData[2].name,
              filterUnitList: filterData[0].values,
              filterCountryList: filterData[1].values,
              filterThirdList: filterData[2].values,
              customFilterUnitKey: filterData[0].key,
              customFilterCountryKey: filterData[1].key,
              customFilterThirdKey: filterData[2].key
            },
            () => {
              if (!localStorage.getItem("selectedState")) {
                localStorage.setItem(
                  "customFiltersConfigCountryFilter",
                  this.state.filterCountryList[0]
                );
                localStorage.setItem(
                  "customFiltersConfigUnitFilter",
                  this.state.filterUnitList[0]
                );
                localStorage.setItem(
                  "customFiltersConfigThirdFilter",
                  this.state.filterThirdList[0]
                );
                localStorage.setItem("customFiltersConfigCountryKey", "state");
                localStorage.setItem("flag", "On");
                localStorage.setItem(
                  "selectedState",
                  this.state.filterCountryList[0]
                );
              }
            }
          );
        } else if (filterData.length === 2) {
          this.setState(
            {
              filterUnitName: filterData[0].name,
              filterCountryName: filterData[1].name,
              filterUnitList: filterData[0].values,
              filterCountryList: filterData[1].values,
              customFilterUnitKey: filterData[0].key,
              customFilterCountryKey: filterData[1].key
            },
            () => {
              if (!localStorage.getItem("selectedState")) {
                localStorage.setItem(
                  "customFiltersConfigCountryFilter",
                  this.state.filterCountryList[0]
                );
                localStorage.setItem(
                  "customFiltersConfigUnitFilter",
                  this.state.filterUnitList[0]
                );
                localStorage.setItem("customFiltersConfigCountryKey", "state");
                localStorage.setItem("flag", "On");
                localStorage.setItem(
                  "selectedState",
                  this.state.filterCountryList[0]
                );
              }
            }
          );
        } else {
          this.setState({
            filterUnitName: filterData[0].name,
            filterUnitList: filterData[0].values,
            customFilterUnitKey: filterData[0].key
          });
        }
      }
    }, 1200);

    MultipleDash.getConfig().then(
      response => {
        this.setState(
          {
            dashCount: Object.keys(response.responseData).length,
            dashboardList: response.responseData
          },
          () => {
            if (!localStorage.getItem("currentDashId")) {
              localStorage.setItem(
                "currentDashId",
                this.state.dashboardList[0].id
              );
              localStorage.setItem(
                "currentDashboard",
                this.state.dashboardList[0].name
              );

              DashboardService.getConfig().then(
                response => {
                  this.setState(prevState => ({
                    ...prevState,
                    dashboardConfigData: response.responseData
                  }));
                },
                error => {}
              );
            }
          }
        );
      },
      error => {}
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleChange = e => {
    let currentList = [];
    let newList = [];
    if (e.target.value !== "") {
      this.state.dashboardList.map(list => currentList.push(list));
      newList = currentList.filter(item => {
        const lc = item.name.toLowerCase();
        const filter = e.target.value.toLowerCase();
        return lc.includes(filter);
      });
    } else {
      this.state.dashboardList.map(list => newList.push(list));
    }

    this.setState({
      searchList: newList
    });
  };

  handleChangeOne = e => {
    let currentList = [];
    let newList = [];
    if (e.target.value !== "") {
      this.state.filterUnitList.map(list => currentList.push(list));
      newList = currentList.filter(item => {
        const lc = item.toLowerCase();
        const filter = e.target.value.toLowerCase();
        return lc.includes(filter);
      });
    } else {
      this.state.filterUnitList.map(list => newList.push(list));
    }

    this.setState({
      searchFilterListOne: newList
    });
  };

  handleChangeTwo = e => {
    let currentList = [];
    let newList = [];
    if (e.target.value !== "") {
      this.state.filterCountryList.map(list => currentList.push(list));
      newList = currentList.filter(item => {
        const lc = item.toLowerCase();
        const filter = e.target.value.toLowerCase();
        return lc.includes(filter);
      });
    } else {
      this.state.filterCountryList.map(list => newList.push(list));
    }

    this.setState({
      searchFilterListTwo: newList
    });
  };

  handleChangeThree = e => {
    let currentList = [];
    let newList = [];
    if (e.target.value !== "") {
      this.state.filterThirdList.map(list => currentList.push(list));
      newList = currentList.filter(item => {
        const lc = item.toLowerCase();
        const filter = e.target.value.toLowerCase();
        return lc.includes(filter);
      });
    } else {
      this.state.filterThirdList.map(list => newList.push(list));
    }

    this.setState({
      searchFilterListThree: newList
    });
  };

  /**
   * Toggle function to show/hide the custom date filters
   */
  showFilterOne = () => {
    this.setState({
      showDropDownOne: true
    });
  };

  /**
   * Toggle function to show/hide the custom date filters
   */
  showFilterTwo = () => {
    this.setState({
      showDropDownTwo: true
    });
  };

  /**
   * Toggle function to show/hide the custom date filters
   */
  showFilterThree = () => {
    this.setState({
      showDropDownThree: true
    });
  };

  /**
   * Toggle function to show/hide the custom date filters
   */
  showCustomFilters = () => {
    this.setState({
      showCustomFilterDD: true
    });
  };

  /**
   * Function to close date dropdown
   * when the user clicks outside it
   */
  handleClickOutside = event => {
    if (
      this.container.current &&
      !this.container.current.contains(event.target)
    ) {
      this.setState({
        showDropDownOne: false,
        showDropDownTwo: false,
        showDropDownThree: false,
        showCustomFilterDD: false
      });
    }
  };

  updateVisuals() {
    localStorage.removeItem("selectedState");
    this.setState({
      trigger: true,
      searchFilterListOne: [],
      searchFilterListTwo: [],
      searchFilterListThree: []
    });
    setTimeout(() => {
      this.props.pathName.history.push({
        pathName: "/dashboards",
        state: { trigger: this.state.trigger }
      });
    }, 1000);
    // this.setState({
    //   trigger: false
    // })
    // setTimeout(() => {this.props.pathName.history.push({pathName: "/dashboards", state: {trigger: this.state.trigger}})}, 1500);
  }

  getUnitFilter(value) {
    this.setState(
      {
        selectedUnitFilter: value
      },
      () =>
        this.setState(
          {
            showDropDownOne: false,
            showCustomFilterDD: false
          },
          localStorage.setItem(
            "customFiltersConfigUnitKey",
            this.state.customFilterUnitKey
          ),
          localStorage.setItem(
            "customFiltersConfigUnitFilter",
            this.state.selectedUnitFilter
          )
        )
    );
    this.updateVisuals();
  }

  getCountryFilter(value) {
    this.setState(
      {
        selectedCountryFilter: value
      },
      () =>
        this.setState(
          {
            showDropDownTwo: false,
            showCustomFilterDD: false
          },
          localStorage.setItem(
            "customFiltersConfigCountryKey",
            this.state.customFilterCountryKey
          ),
          localStorage.setItem(
            "customFiltersConfigCountryFilter",
            this.state.selectedCountryFilter
          )
        )
    );
    this.updateVisuals();
  }

  getThirdFilter(value) {
    this.setState(
      {
        selectedThirdFilter: value
      },
      () =>
        this.setState(
          {
            showDropDownThree: false,
            showCustomFilterDD: false
          },
          localStorage.setItem(
            "customFiltersConfigThirdKey",
            this.state.customFilterThirdKey
          ),
          localStorage.setItem(
            "customFiltersConfigThirdFilter",
            this.state.selectedThirdFilter
          )
        )
    );
    this.updateVisuals();
  }

  render() {
    $(document).ready(function() {
      $("#dashboardDropdown").on("show.bs.dropdown", function() {
        $(".dropdown-menu input").focus();
      });

      $("#dashboardDropdown").on("shown.bs.dropdown", function() {
        $(".dropdown-menu input").focus();
      });

      $("#dashboardDropdown").on("hide.bs.dropdown", function() {
        $(".dropdown-menu input").focus();
      });

      $("#dashboardDropdown").on("hidden.bs.dropdown", function() {
        $(".dropdown-menu input").focus();
      });
    });
    return (
      <nav className="navbar col-md-12 col-lg-12 col-xl-12 tabText horizontalNavBarHeight dateFilter">
        <div className="row d-sm-flex d-md-flex d-lg-flex mb-4">
          <div className="btn-group customDropdown" id="dashboardDropdown">
            <div className="pl-2 pr-4 displayDashboard">
              <span>
                <hr className="topLine" />
              </span>
              {/*{this.state.currentDash || 'Select a dashboard'}*/}
              {localStorage.getItem("currentDashboard") || "Select a dashboard"}
            </div>

            <div className="vlTwo"></div>
            <div
              type=""
              className="dropdown-toggle dropdown-toggle-split cursorStyleOne"
              id="dropdownMenuReference"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              data-reference="parent"
            >
              <span>
                <img
                  className="mb-1 dashboardIcon"
                  alt="dashboard"
                  src="data:image/png;base64,R0lGODlhFAAUAIAAAP///wAAACH5BAEAAAAALAAAAAAUABQAAAIRhI+py+0Po5y02ouz3rz7rxUAOw=="
                  width="15"
                  height="15"
                ></img>
              </span>
              <span className="sr-only">Toggle Dropdown</span>
              <span className="pl-2 mb-1" style={{ fontSize: "1.123em" }}>
                {this.state.dashCount} &nbsp;
              </span>
            </div>

            <div
              className="dropdown-menu"
              aria-labelledby="dropdownMenuReference"
            >
              <input
                type="text"
                className="searchBox mb-4"
                placeholder="Search..."
                onChange={this.handleChange}
              />
              {this.state.searchList.map((list, index) => (
                <NavLink
                  key={index}
                  exact
                  activeClassName=""
                  className="cursorStyleOne"
                  to=""
                  onClick={() => {
                    localStorage.setItem("currentDashId", list.id);
                    localStorage.setItem("currentDashboard", list.name);
                  }}
                >
                  <ul>
                    {localStorage.getItem("currentDashboard") === list.name ? (
                      <hr className="topLine" />
                    ) : (
                      ""
                    )}{" "}
                    {list.name}
                  </ul>
                </NavLink>
              ))}
              {this.state.searchList.length < 1 &&
                this.state.dashboardList.map((list, index) => (
                  <NavLink
                    key={index}
                    exact
                    activeClassName=""
                    className="cursorStyleOne"
                    to=""
                    onClick={() => {
                      localStorage.setItem("currentDashId", list.id);
                      localStorage.setItem("currentDashboard", list.name);
                    }}
                  >
                    <ul>
                      {localStorage.getItem("currentDashboard") ===
                      list.name ? (
                        <hr className="topLine" />
                      ) : (
                        ""
                      )}{" "}
                      {list.name}
                    </ul>
                  </NavLink>
                ))}
            </div>
            <div className="vlTwo"></div>
          </div>

          <div className="row d-md-none d-lg-none d-sm-flex d-xs-flex cursorStyleOne">
            <img
              src="/img/all-filter.png"
              className="table-filter ml-5 filterDrop"
              alt="open filters"
              onClick={this.showCustomFilters}
            />
            {this.state.showCustomFilterDD && (
              <div
                className="row moveRight d-md-none d-lg-none d-sm-flex d-xs-flex cursorStyleOne dateFilter customMobileFilters"
                ref={this.container}
              >
                {this.state.filterUnitName && !this.state.filterThirdName && (
                  <div className="vlTwo"></div>
                )}
                {this.state.filterUnitName && !this.state.filterThirdName && (
                  <div
                    className="ml-3"
                    onClick={this.showFilterOne}
                    style={{ marginRight: "6em" }}
                  >
                    {!this.state.selectedUnitFilter && (
                      <div className="" style={{ marginTop: "2em" }}>
                        <h6>{this.state.filterUnitName}</h6>
                        <p>
                          {localStorage.getItem(
                            "customFiltersConfigUnitFilter"
                          ) || this.state.filterUnitList[0]}
                        </p>
                      </div>
                    )}
                    {this.state.selectedUnitFilter && (
                      <div className="" style={{ marginTop: "2em" }}>
                        <h6>{this.state.filterUnitName}</h6>
                        <p>{this.state.selectedUnitFilter}</p>
                      </div>
                    )}
                  </div>
                )}

                {this.state.filterUnitName && this.state.filterThirdName && (
                  <div
                    className="ml-3"
                    onClick={this.showFilterOne}
                    style={{ marginRight: "2em" }}
                  >
                    {!this.state.selectedUnitFilter && (
                      <div className="" style={{ marginTop: "2em" }}>
                        <h6>{this.state.filterUnitName}</h6>
                        <p>
                          {localStorage.getItem(
                            "customFiltersConfigUnitFilter"
                          ) || this.state.filterUnitList[0]}
                        </p>
                      </div>
                    )}
                    {this.state.selectedUnitFilter && (
                      <div className="" style={{ marginTop: "2em" }}>
                        <h6>{this.state.filterUnitName}</h6>
                        <p>{this.state.selectedUnitFilter}</p>
                      </div>
                    )}
                  </div>
                )}

                {this.state.filterCountryName && !this.state.filterThirdName && (
                  <div
                    className="ml-3"
                    onClick={this.showFilterTwo}
                    style={{ marginRight: "5em" }}
                  >
                    {!this.state.selectedCountryFilter && (
                      <div className="" style={{ marginTop: "2em" }}>
                        <h6>{this.state.filterCountryName}</h6>
                        <p>
                          {localStorage.getItem(
                            "customFiltersConfigCountryFilter"
                          ) || this.state.filterCountryList[0]}
                        </p>
                      </div>
                    )}
                    {this.state.selectedCountryFilter && (
                      <div className="" style={{ marginTop: "2em" }}>
                        <h6>{this.state.filterCountryName}</h6>
                        <p>
                          {localStorage.getItem(
                            "customFiltersConfigCountryFilter"
                          ) || this.state.selectedCountryFilter}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {this.state.filterCountryName && this.state.filterThirdName && (
                  <div
                    className="ml-3"
                    onClick={this.showFilterTwo}
                    style={{ marginRight: "5em" }}
                  >
                    {!this.state.selectedCountryFilter && (
                      <div className="" style={{ marginTop: "2em" }}>
                        <h6>{this.state.filterCountryName}</h6>
                        <p>
                          {localStorage.getItem(
                            "customFiltersConfigCountryFilter"
                          ) || this.state.filterCountryList[0]}
                        </p>
                      </div>
                    )}
                    {this.state.selectedCountryFilter && (
                      <div className="" style={{ marginTop: "2em" }}>
                        <h6>{this.state.filterCountryName}</h6>
                        <p>
                          {localStorage.getItem(
                            "customFiltersConfigCountryFilter"
                          ) || this.state.selectedCountryFilter}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {this.state.filterThirdName && (
                  <div className="ml-3 mr-2" onClick={this.showFilterThree}>
                    {!this.state.selectedThirdFilter && (
                      <div className="" style={{ marginTop: "2em" }}>
                        <h6>{this.state.filterThirdName}</h6>
                        <p>
                          {localStorage.getItem(
                            "customFiltersConfigThirdFilter"
                          ) || "All"}
                        </p>
                      </div>
                    )}
                    {this.state.selectedThirdFilter && (
                      <div className="" style={{ marginTop: "2em" }}>
                        <h6>{this.state.filterThirdName}</h6>
                        <p>{this.state.selectedThirdFilter}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="row moveRight d-none d-md-flex d-lg-flex filterPositioningOne cursorStyleOne">
            {this.state.filterUnitName && !this.state.filterThirdName && (
              <div className="vlTwo"></div>
            )}
            {this.state.filterUnitName && !this.state.filterThirdName && (
              <div className="ml-3 marginR6" onClick={this.showFilterOne}>
                {!this.state.selectedUnitFilter && (
                  <div
                    className=""
                    style={{
                      marginTop: "-0.8em",
                      minWidth: "fitContent",
                      width: "170%",
                      height: "115%"
                    }}
                  >
                    <h6>{this.state.filterUnitName}</h6>
                    <p className="textFormat">
                      {localStorage.getItem("customFiltersConfigUnitFilter") ||
                        "All"}
                    </p>
                  </div>
                )}
                {this.state.selectedUnitFilter && (
                  <div className="" style={{ marginTop: "-0.5em" }}>
                    <h6>{this.state.filterUnitName}</h6>
                    <p className="textFormat">
                      {this.state.selectedUnitFilter}
                    </p>
                  </div>
                )}
              </div>
            )}

            {this.state.filterUnitName && this.state.filterThirdName && (
              <div className="vlTwo"></div>
            )}
            {this.state.filterUnitName && this.state.filterThirdName && (
              <div className="ml-3 marginR4" onClick={this.showFilterOne}>
                {!this.state.selectedUnitFilter && (
                  <div
                    className=""
                    style={{
                      marginTop: "-0.8em",
                      minWidth: "fitContent",
                      width: "170%",
                      height: "115%"
                    }}
                  >
                    <h6>{this.state.filterUnitName}</h6>
                    <p className="textFormat">
                      {localStorage.getItem("customFiltersConfigUnitFilter") ||
                        "All"}
                    </p>
                  </div>
                )}
                {this.state.selectedUnitFilter && (
                  <div className="" style={{ marginTop: "-0.5em" }}>
                    <h6>{this.state.filterUnitName}</h6>
                    <p className="textFormat">
                      {this.state.selectedUnitFilter}
                    </p>
                  </div>
                )}
              </div>
            )}

            {this.state.filterCountryName && !this.state.filterThirdName && (
              <div className="vlTwo"></div>
            )}
            {this.state.filterCountryName && !this.state.filterThirdName && (
              <div className="ml-3 marginR4" onClick={this.showFilterTwo}>
                {!this.state.selectedCountryFilter && (
                  <div
                    className=""
                    style={{
                      marginTop: "-0.8em",
                      minWidth: "fitContent",
                      width: "192%",
                      height: "115%"
                    }}
                  >
                    <h6>{this.state.filterCountryName}</h6>
                    <p className="textFormat">
                      {localStorage.getItem(
                        "customFiltersConfigCountryFilter"
                      ) || this.state.filterCountryList[0]}
                    </p>
                  </div>
                )}
                {this.state.selectedCountryFilter && (
                  <div
                    className=""
                    style={{
                      marginTop: "-0.8em",
                      width: "192%"
                    }}
                  >
                    <h6>{this.state.filterCountryName}</h6>
                    <p className="textFormat">
                      {localStorage.getItem(
                        "customFiltersConfigCountryFilter"
                      ) || this.state.selectedCountryFilter}
                    </p>
                  </div>
                )}
              </div>
            )}

            {this.state.filterCountryName && this.state.filterThirdName && (
              <div className="vlTwo"></div>
            )}
            {this.state.filterCountryName && this.state.filterThirdName && (
              <div className="ml-3 marginR6" onClick={this.showFilterTwo}>
                {!this.state.selectedCountryFilter && (
                  <div
                    className=""
                    style={{
                      marginTop: "-0.8em",
                      minWidth: "fitContent",
                      width: "192%",
                      height: "115%"
                    }}
                  >
                    <h6>{this.state.filterCountryName}</h6>
                    <p className="textFormat">
                      {localStorage.getItem(
                        "customFiltersConfigCountryFilter"
                      ) || this.state.filterCountryList[0]}
                    </p>
                  </div>
                )}
                {this.state.selectedCountryFilter && (
                  <div className="" style={{ marginTop: "-0.5em" }}>
                    <h6>{this.state.filterCountryName}</h6>
                    <p className="textFormat">
                      {localStorage.getItem(
                        "customFiltersConfigCountryFilter"
                      ) || this.state.selectedCountryFilter}
                    </p>
                  </div>
                )}
              </div>
            )}

            {this.state.filterThirdName && <div className="vlTwo"></div>}
            {this.state.filterThirdName && (
              <div className="ml-3" onClick={this.showFilterThree}>
                {!this.state.selectedThirdFilter && (
                  <div
                    className=""
                    style={{
                      marginTop: "-0.8em",
                      minWidth: "fitContent",
                      width: "218%",
                      height: "115%"
                    }}
                  >
                    <h6>{this.state.filterThirdName}</h6>
                    <p className="textFormat">
                      {localStorage.getItem("customFiltersConfigThirdFilter") ||
                        "All"}
                    </p>
                  </div>
                )}
                {this.state.selectedThirdFilter && (
                  <div className="" style={{ marginTop: "-0.5em" }}>
                    <h6>{this.state.filterThirdName}</h6>
                    <p className="textFormat">
                      {this.state.selectedThirdFilter}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/*<div className="row moveRight d-md-none d-lg-none d-sm-flex d-xs-flex cursorStyleOne" style={{zIndex: '1', marginTop:'27%'}}>
           { this.state.filterUnitName && !this.state.filterThirdName && (
               <div className="vlTwo"></div>
           )}
           { this.state.filterUnitName && !this.state.filterThirdName && (
             <div className="ml-3" onClick={this.showFilterOne} style={{marginRight: '6em'}}>
               { !this.state.selectedUnitFilter && (
                 <div className="" style={{marginTop: '-1em'}}>
                   <h6>{this.state.filterUnitName}</h6>
                   <p>{localStorage.getItem("customFiltersConfigUnitFilter") || "All"}</p>
                 </div>
               )}
               {this.state.selectedUnitFilter && (
                 <div className="" style={{marginTop: '-1em'}}>
                   <h6>{this.state.filterUnitName}</h6>
                   <p>{this.state.selectedUnitFilter}</p>
                 </div>
               )}
             </div>
           )}

           { this.state.filterUnitName && this.state.filterThirdName && (
               <div className="vlTwo"></div>
           )}
           { this.state.filterUnitName && this.state.filterThirdName && (
             <div className="ml-3" onClick={this.showFilterOne} style={{marginRight: '4em'}}>
               { !this.state.selectedUnitFilter && (
                 <div className="" style={{marginTop: '-1em'}}>
                   <h6>{this.state.filterUnitName}</h6>
                   <p>{localStorage.getItem("customFiltersConfigUnitFilter") || "All"}</p>
                 </div>
               )}
               {this.state.selectedUnitFilter && (
                 <div className="" style={{marginTop: '-1em'}}>
                   <h6>{this.state.filterUnitName}</h6>
                   <p>{this.state.selectedUnitFilter}</p>
                 </div>
               )}
             </div>
           )}

           { this.state.filterCountryName && !this.state.filterThirdName && (
             <div className="vlTwo"></div>
           )}
           { this.state.filterCountryName && !this.state.filterThirdName && (
             <div className="ml-3" onClick={this.showFilterTwo} style={{marginRight: '6em'}}>
               { !this.state.selectedCountryFilter && (
                 <div className="" style={{marginTop: '-1em'}}>
                   <h6>{this.state.filterCountryName}</h6>
                   <p>{localStorage.getItem("customFiltersConfigCountryFilter") || "All"}</p>
                 </div>
               )}
               {this.state.selectedCountryFilter && (
                 <div className="" style={{marginTop: '-1em'}}>
                   <h6>{this.state.filterCountryName}</h6>
                   <p>{this.state.selectedCountryFilter}</p>
                 </div>
               )}
             </div>
           )}

           { this.state.filterCountryName && this.state.filterThirdName && (
             <div className="vlTwo"></div>
           )}
           { this.state.filterCountryName && this.state.filterThirdName && (
             <div className="ml-3" onClick={this.showFilterTwo} style={{marginRight: '6em'}}>
               { !this.state.selectedCountryFilter && (
                 <div className="" style={{marginTop: '-1em'}}>
                   <h6>{this.state.filterCountryName}</h6>
                   <p>{localStorage.getItem("customFiltersConfigCountryFilter") || "All"}</p>
                 </div>
               )}
               {this.state.selectedCountryFilter && (
                 <div className="" style={{marginTop: '-1em'}}>
                   <h6>{this.state.filterCountryName}</h6>
                   <p>{this.state.selectedCountryFilter}</p>
                 </div>
               )}
             </div>
           )}

           { this.state.filterThirdName && (
             <div className="vlTwo"></div>
           )}
           { this.state.filterThirdName && (
             <div className="ml-3 mr-3" onClick={this.showFilterThree}>
               { !this.state.selectedThirdFilter && (
                 <div className="" style={{marginTop: '-1em'}}>
                   <h6>{this.state.filterThirdName}</h6>
                   <p>{localStorage.getItem("customFiltersConfigThirdFilter") || "All"}</p>
                 </div>
               )}
               {this.state.selectedThirdFilter && (
                 <div className="" style={{marginTop: '-1em'}}>
                   <h6>{this.state.filterThirdName}</h6>
                   <p>{this.state.selectedThirdFilter}</p>
                 </div>
               )}
             </div>
           )}
         </div>*/}

        {this.state.showDropDownOne && this.state.filterCountryName && (
          <div
            className="container filterDropDownOne cursorStyleOne"
            ref={this.container}
          >
            <div className="">
              <input
                type="text"
                id="inputToFocusOne"
                className="searchBox mb-4"
                placeholder="Search..."
                onChange={this.handleChangeOne}
                autoFocus
              />
              {this.state.searchFilterListOne.map((list, index) => (
                <ul
                  key={index}
                  className="cursorStyleOne"
                  onClick={() => this.getUnitFilter(list)}
                >
                  {localStorage.getItem("customFiltersConfigUnitFilter") ===
                  list ? (
                    <hr className="topLine" />
                  ) : (
                    ""
                  )}{" "}
                  {list}
                </ul>
              ))}
              {this.state.searchFilterListOne.length < 1 &&
                this.state.filterUnitList.map((list, index) => (
                  <ul
                    key={index}
                    className="cursorStyleOne"
                    onClick={() => this.getUnitFilter(list)}
                  >
                    {localStorage.getItem("customFiltersConfigUnitFilter") ===
                    list ? (
                      <hr className="topLine" />
                    ) : (
                      ""
                    )}{" "}
                    {list}
                  </ul>
                ))}
            </div>
          </div>
        )}
        {this.state.showDropDownOne && !this.state.filterCountryName && (
          <div
            className="container filterDropDownTwo cursorStyleOne"
            ref={this.container}
          >
            <div className="">
              <input
                type="text"
                id="inputToFocusTwo"
                className="searchBox mb-4"
                placeholder="Search..."
                onChange={this.handleChangeOne}
                autoFocus
              />
              {this.state.searchFilterListOne.map((list, index) => (
                <ul
                  key={index}
                  className="cursorStyleOne"
                  onClick={() => this.getUnitFilter(list)}
                >
                  {localStorage.getItem("customFiltersConfigUnitFilter") ===
                  list ? (
                    <hr className="topLine" />
                  ) : (
                    ""
                  )}{" "}
                  {list}
                </ul>
              ))}
              {this.state.searchFilterListOne.length < 1 &&
                this.state.filterUnitList.map((list, index) => (
                  <ul
                    key={index}
                    className="cursorStyleOne"
                    onClick={() => this.getUnitFilter(list)}
                  >
                    {localStorage.getItem("customFiltersConfigUnitFilter") ===
                    list ? (
                      <hr className="topLine" />
                    ) : (
                      ""
                    )}{" "}
                    {list}
                  </ul>
                ))}
            </div>
          </div>
        )}
        {this.state.showDropDownTwo && (
          <div
            className="container filterDropDownThree cursorStyleOne"
            ref={this.container}
          >
            <div className="">
              <input
                type="text"
                id="inputToFocusThree"
                className="searchBox mb-4"
                placeholder="Search..."
                onChange={this.handleChangeTwo}
                autoFocus
              />
              {this.state.searchFilterListTwo.map((list, index) => (
                <ul
                  key={index}
                  className="cursorStyleOne"
                  onClick={() => this.getCountryFilter(list)}
                >
                  {localStorage.getItem("customFiltersConfigCountryFilter") ===
                  list ? (
                    <hr className="topLine" />
                  ) : (
                    ""
                  )}{" "}
                  {list}
                </ul>
              ))}
              {this.state.searchFilterListTwo.length < 1 &&
                this.state.filterCountryList.map((list, index) => (
                  <ul
                    key={index}
                    className="cursorStyleOne"
                    onClick={() => this.getCountryFilter(list)}
                  >
                    {localStorage.getItem(
                      "customFiltersConfigCountryFilter"
                    ) === list ? (
                      <hr className="topLine" />
                    ) : (
                      ""
                    )}{" "}
                    {list}
                  </ul>
                ))}
            </div>
          </div>
        )}
        {this.state.showDropDownThree && (
          <div
            className="container filterDropDownFour cursorStyleOne"
            ref={this.container}
          >
            <div className="">
              <input
                type="text"
                id="inputToFocusFour"
                className="searchBox mb-4"
                placeholder="Search..."
                onChange={this.handleChangeThree}
                autoFocus
              />
              {this.state.searchFilterListThree.map((list, index) => (
                <ul
                  key={index}
                  className="cursorStyleOne"
                  onClick={() => this.getThirdFilter(list)}
                >
                  {localStorage.getItem("customFiltersConfigThirdFilter") ===
                  list ? (
                    <hr className="topLine" />
                  ) : (
                    ""
                  )}{" "}
                  {list}
                </ul>
              ))}
              {this.state.searchFilterListThree.length < 1 &&
                this.state.filterThirdList.map((list, index) => (
                  <ul
                    key={index}
                    className="cursorStyleOne"
                    onClick={() => this.getThirdFilter(list)}
                  >
                    {localStorage.getItem("customFiltersConfigThirdFilter") ===
                    list ? (
                      <hr className="topLine" />
                    ) : (
                      ""
                    )}{" "}
                    {list}
                  </ul>
                ))}
            </div>
          </div>
        )}
        <DateFilter pathName={this.props} history={this.props.history} />
      </nav>
    );
  }
}

export default FilterNavBar;
