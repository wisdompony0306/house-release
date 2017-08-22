import wkValidate from './wkvalidate';
import prepareSubmit from './prepareSubmit';
import getVueData from './getVueData';

const { formState } = getVueData();

/**
 * 点击提交按钮时触发的业务逻辑
 * @param:
 * formRef: form的vue-$ref，用于表单的静态校验
 */
export default function ({ formRef }) {
    // 表单组件级别的校验:
    console.log('>> 开始校验表单');
    formRef.validate((valid) => {
        if (valid) { // 表单校验通过
            console.log('>> 表单校验通过');

            // 孙悟空校验:
            wkValidate()

                // 悟空校验通过
                .then(() => {
                    console.log('>> 悟空校验通过');
                    prepareSubmit();
                })

                // 悟空校验未通过，或者校验过程中发生了其他error（如网络错误等）
                .catch((e) => {
                    console.log('>> 悟空校验过程中发生了异常：', e);
                });
        } else { // 表单校验未通过（会自动提示）
            formState.submitButtonDisabled = false;
        }
    });
}
