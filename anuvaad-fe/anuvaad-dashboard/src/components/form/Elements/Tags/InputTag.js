import React from "react";
const $ = window.$;

class InputTag extends React.Component {
  constructor() {
    super();

    this.state = {
      // tags: ["Tags", "Input"]
      tags: [],
    };
  }

  componentDidMount() {
    $(function () {
      $(".sortable").on("mouseover", ".input-tag__tags li", function (event) {
        $(event.target).children("button").css("visibility", "visible");
      });

      $(".sortable").on("mouseover", ".input-tag__tags li button", function (
        event
      ) {
        $(event.target).css("visibility", "visible");
      });

      $(".sortable").on("mouseout", ".input-tag__tags li", function (event) {
        $(event.target).children("button").css("visibility", "hidden");
      });
    });
    if (this.props.tags) {
      let tags = [];
      this.props.tags.forEach(function (option) {
        tags.push(option.value);
      });
      this.setState({
        tags: tags,
      });
    }
  }

  removeTag = (i) => {
    const newTags = [...this.state.tags];
    newTags.splice(i, 1);
    this.setState({ tags: newTags });
  };

  inputKeyDown = (e) => {
    const val = e.target.value;
    if (e.key === "Enter" && val) {
      if (
        this.state.tags.find((tag) => tag.toLowerCase() === val.toLowerCase())
      ) {
        return;
      }
      this.setState({ tags: [...this.state.tags, val] });
      this.tagInput.value = null;
    } else if (e.key === "Backspace" && !val) {
      this.removeTag(this.state.tags.length - 1);
    }
  };

  render() {
    const { tags } = this.state;

    return (
      <div className="input-tag">
        <ul className="input-tag__tags">
          {tags.map((tag, i) => (
            <li className="tag" key={tag}>
              {tag}
              <button
                type="button"
                onClick={() => {
                  this.removeTag(i);
                }}
              >
                +
              </button>
            </li>
          ))}
          <li className="input-tag__tags__input">
            <input
              type="text"
              onKeyDown={this.inputKeyDown}
              ref={(c) => {
                this.tagInput = c;
              }}
              placeholder="Enter options"
            />
          </li>
        </ul>
      </div>
    );
  }
}

export default InputTag;
