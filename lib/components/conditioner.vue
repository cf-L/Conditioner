<template>
  <div>
    <el-button type="text" @click="dialogVisible = true">筛选</el-button>

    <el-dialog
      title="筛选"
      :visible.sync="dialogVisible"
      width="50%">

      <el-form>

        <el-form-item size="mini" v-for="(option, index) in displayEl">
          <el-row :gutter="5">

          <el-col :span="1" v-if="option.type === 'Date' || option.selEnable == false">
            <el-button
              type="text"
              style="color: #f56c6c;"
              :id="'conditionRemove-' + index"
              @click="removeAction($event)">
              一
            </el-button>
          </el-col>

          <el-col :span="4" :offset="option.selEnable ? 1 : 0">
            <el-select
              :disabled="option.selEnable"
              v-model="option.alias"
              @focus="nameSelFocus"
              @change="nameSelChange"
              :id="'conditionName-' + index">

              <el-option
                v-for="(n, j) in options.alias"
                :key="n"
                :label="options.names[j]"
                :value="n">
              </el-option>
            </el-select>
          </el-col>

          <el-col :span="4">
            <el-select v-model="option.sopt">
              <el-option
                v-for="(s, i) in option.soptObjs"
                :key="s.sopt"
                :value="s.sopt"
                :label="s.name">
              </el-option>
            </el-select>
          </el-col>

          <el-col :span="15" v-if="option.type !== 'Date'">
            <el-input clearable placeholder="请输入内容" v-model="option.value"></el-input>
          </el-col>

          <el-col :span="8" v-if="option.type === 'Date' && option.sopt !== 'bt'">
            <el-date-picker
            v-model="option.value"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="datePickerOption">
            </el-date-picker>
          </el-col>

          <el-col :span="8" v-if="option.type === 'Date' && option.sopt === 'bt'">
            <el-date-picker
              v-model="option.value"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="datePickerOption">
            </el-date-picker>
          </el-col>
          </el-row>


        </el-form-item>

      </el-form>


      <span slot="footer" class="dialog-footer">
        <el-button type="text" style="color: #DD928E;" @click="addAction">添加</el-button>
        <el-button type="text" @click="dialogVisible = false">取 消</el-button>
        <el-button type="text" @click="okAction">确 定</el-button>
      </span>

    </el-dialog>
  </div>

</template>

<script>
  import relationship from '../sopt'

  export default {
    name: 'conditioner',
    props: {
      options: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        dialogVisible: false,
        displayEl: [],
        nameSelIndex: -1,
        datePicker: '',
        datePickerOption: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }]
        }
      }
    },
    created() {
      this.displayEl = this.requiredEl()
    },
    methods: {
      okAction() {
        if (!this.check()) {
          this.$message.error('需要填写完整条件，每行前面没带"一"为必填内容')
          return
        }
        this.dialogVisible = false
        console.log(this.finalEl())
      },
      addAction() {
        this.displayEl.push(this.defaultEl())
      },
      nameSelFocus(event) {
        if (event.target.id) {
          this.nameSelIndex = parseInt(event.target.id.split('-')[1])
        }
      },
      nameSelChange(alias) {
        if (this.nameSelIndex > -1) {
          const model = this.options.model.filter(x => x.alias === alias)[0]
          if (!model) { return }
          const el = this.displayEl[this.nameSelIndex]
          const soptObject = this.soptObject(model.sopt)
          el.type = model.type
          el.required = model.required
          el.soptObjs = soptObject
          el.sopt = soptObject[0] ? soptObject[0].sopt : ''
          // Trigger Vue update, 'this.displayEl[this.nameSelIndex] = el' is useless
          this.displayEl.splice(this.nameSelIndex, 1, el)
        }
      },
      removeAction(event) {
        const id = event.currentTarget.id
        const index = id.split('-')[1]
        if (this.displayEl.length > 1) {
          this.displayEl.splice(index, 1)
        }
      },
      soptObject(sopts) {
        return sopts.map(x => {
          return { sopt: x, name: relationship[x] }
        })
      },
      defaultEl() {
        if (this.options.model && this.options.model.length > 0) {

          let firstAlias = ''
          if (this.options.alias && this.options.alias[0]) {
            firstAlias = this.options.alias[0]
          }

          const firstModel = this.options.model[0]

          const soptObjs = this.soptObject(firstModel.sopt)
          const sopt = soptObjs[0] ? soptObjs[0].sopt : ''
          return {
            alias: firstAlias,
            type: firstModel.type,
            soptObjs: soptObjs,
            sopt: sopt,
            value: '',
            required: firstModel.required,
            selEnable: false
          }
        }
        return {}
      },
      requiredEl() {
        const _this = this
        const model = this.options.model.filter(x => x.required)
        const els = model.map(x => {
          const soptObjs = _this.soptObject(x.sopt)
          const sopt = soptObjs[0] ? soptObjs[0] : ''
          return {
            alias: x.alias,
            type: x.type,
            soptObjs: soptObjs,
            sopt: sopt,
            value: '',
            required: x.required,
            selEnable: true
          }
        })

        return els.length > 0 ? els : [this.defaultEl()]
      },
      finalEl() {
        return this.displayEl.map(x => {
          return {
            alias: x.alias,
            type: x.type,
            sopt: x.sopt,
            value: x.value
          }
        }).filter(x => x.sopt !== '' && x.value !== '')
      },
      check() {
        let success = true
        const reqEl = this.displayEl.filter(x => x.required)

        const aliasArr = Array.from(new Set(reqEl.map(x => x.alias)))
        for (const alias of aliasArr) {
          const validEl = reqEl.filter(x => x.alias === alias && x.sopt !== '' && x.value !== '')
          if (validEl.length === 0) {
            success = false
            break
          }
        }
        return success
      }
    }
  }
</script>

<style scoped>

</style>
