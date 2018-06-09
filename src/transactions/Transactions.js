import React from 'react';
import { AutoComplete, Button, Select, List } from 'antd';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { isEmpty } from 'lodash/fp';
import {
  addTransaction as addT,
  updateTransaction as updateT
} from './TransactionsActions';

type transaction = { name: string, cost: number, category: string };
type Props = {
  allTransactions: transaction[],
  currentTransaction: transaction,
  updateTransaction: (name: string, cost: number, category: string) => void,
  addTransaction: transaction => void
};

const MOCK_CATEGORIES = ['Food', 'Sport', 'Travel'];
const { Option } = Select;

const isValid = (t: transaction) =>
  Object.values(t).every(k => !isEmpty(k) && k !== 0);

export const Transactions = ({
  currentTransaction,
  updateTransaction,
  addTransaction,
  allTransactions
}: Props) => (
  <div>
    <h3>Handle transactions</h3>
    <AutoComplete
      onSearch={val =>
        updateTransaction(
          val,
          currentTransaction.cost,
          currentTransaction.category
        )
      }
      value={currentTransaction.name}
      autoFocus
      placeholder="Name"
    />
    <AutoComplete
      onSearch={val =>
        updateTransaction(
          currentTransaction.name,
          val,
          currentTransaction.category
        )
      }
      value={currentTransaction.cost || ''}
      placeholder="Cost"
    />
    <Select
      showSearch
      style={{ width: 200 }}
      placeholder="Select category"
      optionFilterProp="children"
      onChange={val =>
        updateTransaction(currentTransaction.name, currentTransaction.cost, val)
      }
      filterOption={(input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {MOCK_CATEGORIES.map(c => (
        <Option key={c} value={c.toLowerCase()}>
          {c}
        </Option>
      ))}
    </Select>
    <Button
      type="primary"
      disabled={!isValid(currentTransaction)}
      onClick={() => addTransaction(currentTransaction)}
    >
      Add transaction
    </Button>
    <List
      dataSource={allTransactions}
      renderItem={item => (
        <List.Item>{`${item.name}       ${item.cost}`}</List.Item>
      )}
    />
  </div>
);

const mapStateToProps = state => ({
  ...state.transactions
});

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  updateTransaction: (name, cost, category) =>
    dispatch(updateT(name, cost, category)),
  addTransaction: t => dispatch(addT(t))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Transactions);
