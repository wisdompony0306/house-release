<style lang="less">
    @import "../../assets/mixins";

    .fang_checkbox {
        display: inline-block;
        line-height: 24px;
        margin: 5px 5px;
        padding: 0 13px;
        .font-size-dpr(24px);
        color: #9a9a9a;
        background: #fff;
        border: 1px solid #f0f0f0;
        border-radius: 2px;

        &.checked {
             color: #ff552e;
             background: #fff5e5;
             border-color: #ff552e;
         }
    }
</style>

<template>
    <div class="fang_checkbox_group">
        <span v-for="item of c_data"
              class="fang_checkbox"
              :class="{checked:item.checked}"
              @click="handleClick(item.val, item.checked)">
            {{ item.text }}
        </span>
    </div>
</template>

<script>
    // todo 改为双绑形式
    export default {
        props: {
            value: {
                type: Object,
                default () {
                    return {
                        allData: [],
                        selected: '',
                    }
                },
            }
        },
        computed: {

            // 用于绘制视图
            c_data () {
                return this.value.allData.map((item) => {
                    item.checked = this.value.selected.includes(item.val);
                    return item;
                });
            }
        },
        methods: {
            handleClick (curVal, checked) {
                let new_val = JSON.parse(JSON.stringify(this.value));
                let selected = new_val.allData
                    .map((item) => {
                        if (item.val === curVal) {
                            item.checked = !item.checked;
                        }
                        return item;
                    })
                    .filter(item => item.checked)
                    .map(item => item.val)
                    .join('|');
                new_val.selected = selected;
                this.$emit('input', new_val);
            }
        }
    }
</script>
