import React from 'react';

export default (WrapComponent, handler) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        qo: {},
        dataSet: [],
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0,
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100']
        }
      };
    }

    componentDidMount() {
      this.handleSearch();
    }

    searchData = () => {
      let qo = Object.assign({}, this.state.qo, {
        pageNum: this.state.pagination.current,
        pageSize: this.state.pagination.pageSize
      });
      handler(qo).then(ds => {
        this.setState({
          dataSet: ds.data,
          pagination: Object.assign({}, this.state.pagination, {
            total: ds.total?Number.parseInt(ds.total * 1):0
          })
        });
      });
    };

    getCom = () => {
      if (this.wrapFormCom) {
        return this.wrapFormCom;
      } else if (this.wrapCom) {
        return this.wrapCom;
      }else{
        return {};
      }
      
    };
    /**
     * 点击查询处理
     */
    handleSearch = () => {
      let values = {};
      console.log(this.getCom(),'..................')
      if (this.getCom().getQueryCondition) {
        values = this.getCom().getQueryCondition();
      } else if (this.getCom().props&&this.getCom().props.form) {
        values = this.getCom().props.form.getFieldsValue();
      } else {
        values = Object.keys(this.getCom()).length&&this.getCom().getFieldsValue()
      }
      this.setState(
        {
          qo: values,
          pagination: Object.assign({}, this.state.pagination, { current: 1 })
        },
        () => {
          this.searchData();
        }
      );
    };

    /**
     * 显示总记录数处理
     */
    showTotal = total => {
      return `共 ${total} 条`;
    };
    /**
     * 翻页处理
     */
    changeNum = (pageNum, pageSize) => {
      this.setState(
        {
          pagination: Object.assign({}, this.state.pagination, {
            current: pageNum
          })
        },
        () => {
          this.searchData();
        }
      );
    };
    /**
     * 修改每页记录数处理
     */
    changePageSize = (pageNum, pageSize) => {
      this.setState(
        {
          pagination: Object.assign({}, this.state.pagination, {
            current: 1,
            pageSize: pageSize
          })
        },
        () => {
          this.searchData();
        }
      );
    };

    render() {
      return (
        <WrapComponent
          wrappedComponentRef={com => (this.wrapFormCom = com)}
          ref={com => (this.wrapCom = com)}
          searchData={this.handleSearch}
          showTotal={this.showTotal}
          changeNum={this.changeNum}
          changePageSize={this.changePageSize}
          {...this.props}
          {...this.state}
        />
      );
    }
  };
};
