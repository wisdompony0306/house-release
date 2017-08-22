<!--
    desc: 表单组件,表单数据及校验
-->
<style rel="stylesheet/less" lang="less">
    @fFontSize: 14px;
    @fPadding: px2rem(20px);

    .fang_form {
        width: 100%;
        box-sizing: border-box;
        padding: @fPadding;
        font-size: @fFontSize;
    }
</style>
<template>
    <form class="fang_form">
        <slot></slot>
    </form>
</template>
<script>
    import FangActions from "@actions";
    import EventHub from "./eventHub";

    export default {
        name: 'FangForm',
        data() {
            return {
                /**
                 * 表单元素记录,一定是跟表单数据的元素,如:input
                 */
                records: []
            };
        },
        /**
         * todo:
         * 这两个监听需要修改,之前对vue的api不太熟,
         * 可以用实例的this.$children来递归遍历直接子组件,就不需要再用records来记录了
         */
        created() {
            /**
             * 监听表单元素的添加
             */
            EventHub.$on(FangActions.FORM_RECORDS_ADD, (record) => {
                if (record) {
                    this.records.push(record);
                }
            });
            /**
             * 监听表单项的删除
             */
            EventHub.$on(FangActions.FORM_RECORDS_REMOVE, (record) => {
                if (record) {
                    this.records.splice(this.records.indexOf(record), 1);
                }
            });
        },
        methods: {
            /**
             * 遍历每一个表单元素的验证
             * @param callback
             * @returns {boolean}
             */
            validate (callback) {
                let valid = true;
                const records = this.records;
                const len = records.length;
                if (len) {
                    for (let i = 0; i < len; ++i) {
                        const record = records[i];
                        const record0 = record[0];
                        if (record && typeof record0.validate === "function") {
                            const result = record0.validate();
                            if (!result.validateState) {
                                valid = false;
                                console.log('不合法的字段：', record);
                                EventHub.$emit(FangActions.TOAST_MESSAGET, result.validateMsg);
                                break;
                            }
                        }
                    }
                }
                if (typeof callback === "function") {
                    callback(valid);
                }
                return valid;
            },
        }
    };
</script>
