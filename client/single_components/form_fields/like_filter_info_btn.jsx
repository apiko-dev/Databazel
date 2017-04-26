import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
  from 'material-ui/Table';

const style = {
  infoBtnContainer: {
    display: 'inline',
  },
  infoBtn: {
    minWidth: '32px',
  },
  infoBtnIcon: {
    verticalAlign: 'middle',
  },
  exampleCell: {
    width: '25%',
    padding: '8px',
  },
  descCell: {
    width: '75%',
    padding: '8px',
  },
  tableStyle: {
    width: '600px',
  },
};

const tableData = [
  {
    example: "LIKE 'a%'",
    desc: "Finds any values that starts with 'a'",
  },
  {
    example: "LIKE '%a'",
    desc: "Finds any values that ends with 'a'",
  },
  {
    example: "LIKE '%or%'",
    desc: "Finds any values that have 'or' in any position",
  },
  {
    example: "LIKE '_r%'",
    desc: "Finds any values that have 'r' in the second position",
  },
  {
    example: "LIKE 'a_%_%'",
    desc: "Finds any values that starts with 'a' and are at least 3 characters in length",
  },
  {
    example: "LIKE 'a%o'",
    desc: "Finds any values that starts with 'a' and ends with 'o'",
  },
];

class LikeFilterInfoBtn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popoverOpen: false,
    };
    this.handlePopverTouchTap = this.handlePopverTouchTap.bind(this);
    this.handlePopverRequestClose = this.handlePopverRequestClose.bind(this);
  }

  handlePopverTouchTap(event) {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      popoverOpen: true,
      popoverAnchorEl: event.currentTarget,
    });
  }

  handlePopverRequestClose() {
    this.setState({
      popoverOpen: false,
    });
  }

  render() {
    const { handlePopverTouchTap, handlePopverRequestClose } = this;
    const { popoverOpen, popoverAnchorEl } = this.state;
    const {
      infoBtnContainer,
      infoBtnIcon,
      infoBtn,
      exampleCell,
      descCell,
      tableStyle,
    } = style;

    return (
      <div style={infoBtnContainer}>
        <FlatButton
          iconClassName="material-icons"
          style={infoBtn}
          onTouchTap={handlePopverTouchTap}
        >
          <i className="material-icons" style={infoBtnIcon}>info</i>
        </FlatButton>
        <Popover
          open={popoverOpen}
          anchorEl={popoverAnchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={handlePopverRequestClose}
          animation={PopoverAnimationVertical}
        >
          <Table selectable style={tableStyle}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn
                  colSpan="3"
                  tooltip="Super Header"
                  style={{ textAlign: 'center' }}
                >
                  LIKE filter rules
                </TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody
              displayRowCheckbox={false}
              deselectOnClickaway
              showRowHover
            >
              {tableData.map((row, index) => (
                <TableRow key={index} displayRowCheckbox={false}>
                  <TableRowColumn style={exampleCell}>{row.example}</TableRowColumn>
                  <TableRowColumn style={descCell}>{row.desc}</TableRowColumn>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Popover>
      </div>
    );
  }
}

export default LikeFilterInfoBtn;
