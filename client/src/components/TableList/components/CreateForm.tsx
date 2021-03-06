import React, { useState } from 'react';
import { Form, Modal, Input, InputNumber } from 'antd';
import { FormComponentProps } from 'antd/es/form';

import * as styles from '../index.less';

const FormItem = Form.Item;

interface DetailFormProps extends FormComponentProps {
  createFormVisible: boolean;
  pushConfirmLoading: boolean;
  setCreateFormVisible: (visible: boolean) => void;
  setPushConfirmLoading: (visible: boolean) => void;
  handleAddPackage: (data: FormData) => void;
}
const CreateForm: React.FC<DetailFormProps> = (props) => {
  const {
    createFormVisible,
    setCreateFormVisible,
    pushConfirmLoading,
    setPushConfirmLoading,
    handleAddPackage,
    form
  } = props;

  let [uploadFile, setUploadFile] = useState({} as File);

  const handleInputFileChange = () => {
    const files = (document.querySelector('#fileUpload') as HTMLInputElement)
      .files;
    if (files && files.length > 0) {
      setUploadFile(files[0]);
    }
  };

  const cancelHandle = () => {
    form.resetFields();

    // 重置 input file
    setUploadFile({} as File);
    (document.querySelector('#fileUpload') as HTMLInputElement).value = '';

    setCreateFormVisible(false);
  };

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      setPushConfirmLoading(true);

      const formData = new FormData();
      Object.keys(fieldsValue)
        .filter((key) => key !== 'file')
        .forEach((key) => {
          formData.append(key, fieldsValue[key]);
        });
      formData.append('file', uploadFile);

      handleAddPackage(formData);

      // 重置 input file
      setUploadFile({} as File);
      (document.querySelector('#fileUpload') as HTMLInputElement).value = '';
    });
  };

  return (
    <Modal
      title="新增离线包"
      okText="确认"
      cancelText="取消"
      closable={false}
      confirmLoading={pushConfirmLoading}
      visible={createFormVisible}
      onCancel={cancelHandle}
      onOk={okHandle}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="模块名">
        {form.getFieldDecorator('moduleName', {
          rules: [
            {
              required: true,
              message: '请输入模块名'
            }
          ]
        })(<Input maxLength={10} placeholder="建议用英文命名" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="版本号">
        {form.getFieldDecorator('version', {
          rules: [
            {
              required: true,
              message: '请输入版本号'
            }
          ]
        })(<InputNumber precision={0} min={0} />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="app名">
        {form.getFieldDecorator('appName', {
          rules: [
            {
              required: true,
              message: '请输入 APP 名'
            }
          ]
        })(<Input maxLength={10} placeholder="建议用英文命名" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="更新日志"
      >
        {form.getFieldDecorator('updateLog', {
          rules: [
            {
              required: true,
              message: '请输入更新日志'
            }
          ]
        })(<Input.TextArea maxLength={150} placeholder="最多不超过150字" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="离线包">
        {form.getFieldDecorator('file', {
          rules: [
            {
              required: true,
              message: '请上传离线包'
            }
          ]
        })(
          <div>
            <input
              type="file"
              id="fileUpload"
              className={styles.input_file}
              onChange={handleInputFileChange}
            />
            <label htmlFor="fileUpload" className={styles.label_file}>
              上传离线包
            </label>
            <div>{uploadFile.name}</div>
          </div>
        )}
      </FormItem>
    </Modal>
  );
};

export default Form.create<DetailFormProps>()(CreateForm);
