<template>
  <div>
    <el-button
      :type="buttonType || 'text'"
      :size="buttonSize || 'small'"
      :icon="icon"
      @click="dialogVisible = true">{{text}}</el-button>

    <el-dialog
      title="Search"
      :visible.sync="dialogVisible"
      :width="width">

      <el-form>

        <el-form-item size="mini" v-for="(option, index) in displayEl" :key="'condition-'+index">
          <el-row :gutter="5">

            <el-col :span="1" v-if="option.selEnable == false">
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

            <el-col :span="15" v-if="option.type !== 'Date' && option.type !== 'Selector' && !option.remote">
              <el-input
                clearable
                placeholder="Please input"
                v-model="option.value">
              </el-input>
            </el-col>

            <el-col :span="15" v-if="option.type !== 'Date' && option.type !== 'Selector' && option.remote">
              <el-autocomplete
                clearable placeholder="Please input"
                v-model="option.value"
                :id="'autoComplete-' + index"
                @focus="autoCompletedFocus"
                :fetch-suggestions="querySearchAsync">
              </el-autocomplete>
            </el-col>

            <el-col :span="6" v-if="option.type === 'Selector'">
              <el-select v-model="option.value" @focus="remoteSelectorFocus" :id="'selector-' + index">
                <el-option
                  v-for="(op, i) in option.selectOptions"
                  :key="op.key"
                  :value="op.value"
                  :label="op.label">
                </el-option>
              </el-select>
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
        <el-button type="text" icon="el-icon-plus" style="color: #67c23a;" @click="addAction"></el-button>
        <el-button type="text" icon="el-icon-search" @click="okAction"></el-button>
      </span>

    </el-dialog>
  </div>

</template>

<style>
  .el-autocomplete-suggestion {
    width: auto!important;
  }

  .el-autocomplete {
    width: 100%;
  }
</style>

<script>
  import relationship from '../sopt'
  import axios from 'axios'

  export default {
    name: 'conditioner',
    props: {
      options: {
        type: Object,
        required: true
      },
      width: {
        type: String,
        required: true
      },
      buttonType: {
        type: String,
        required: false
      },
      icon: {
        type: String,
        required: false
      },
      text: {
        type: String,
        required: false
      },
      buttonSize: {
        type: String,
        required: false
      }
    },
    data() {
      return {
        dialogVisible: false,
        displayEl: [],
        nameSelIndex: -1,
        autoCompleteIndex: -1,
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
    mounted() {
      this.displayEl = this.requiredEl()
    },
    methods: {
      okAction(evt) {
        if (!this.check()) {
          this.$message.error('需要填写完整条件，每行前面没带"一"为必填内容')
          return
        }
        this.dialogVisible = false
        const finalEl = this.finalEl()
        console.log(finalEl)
        this.$emit('search', evt, finalEl)
      },

      addAction() {
        this.displayEl.push(this.defaultEl())
      },

      querySearchAsync(text, cb) {
        const _this = this
        if (this.autoCompleteIndex > -1) {
          const model = this.displayEl[this.autoCompleteIndex]

          if (!model || !model.remote) { cb([]) }

          const relatedObj = {}
          if (model.related) {
            for (const re of model.related) {
              relatedObj[re] = this.displayEl.filter(x => x.alias === re).map(x => x.value).filter(x => x !== '')
            }
          }

          const queryObj = Object.assign({}, { 'query': text }, relatedObj)

          this.axiosMethod(model.remote.method)(model.remote.url, queryObj)
            .then(function(response) {
              cb(response.data)
            })
            .catch(function(error) {
              _this.$message.error(error)
            })
        }
      },

      autoCompletedFocus(event) {
        if (event.path[2].id) {
          this.autoCompleteIndex = parseInt(event.path[2].id.split('-')[1])
        }
      },

      remoteSelectorFocus(event) {
        console.log('ddd')
        const _this = this
        if (event.target.id) {
          const index = parseInt(event.target.id.split('-')[1])
          const model = this.displayEl[index]

          const relatedObj = {}
          if (model.related) {
            for (const re of model.related) {
              relatedObj[re] = this.displayEl.filter(x => x.alias === re).map(x => x.value).filter(x => x !== '')
            }
          }

          if (!model || !model.remote) { return }

          this.axiosMethod(model.remote.method)(model.remote.url, relatedObj)
            .then(function(response) {
              if (response.data) {
                model.selectOptions = response.data
                _this.displayEl.splice(index, 1, model)
              }
            })
            .catch(function(err) {
              _this.$message.error(err)
            })
        }
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
          el.remote = model.remote
          el.selectOptions = model.selectOptions || []
          el.value = ''
          el.related = model.related
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
            selEnable: false,
            remote: firstModel.remote,
            selectOptions: firstModel.selectOptions || [],
            related: firstModel.related
          }
        }
        return {}
      },

      requiredEl() {
        const _this = this
        const model = this.options.model.filter(x => x.required)
        const els = model.map(x => {
          const soptObjs = _this.soptObject(x.sopt)
          const sopt = soptObjs[0] ? soptObjs[0].sopt : ''
          return {
            alias: x.alias,
            type: x.type,
            soptObjs: soptObjs,
            sopt: sopt,
            value: '',
            required: x.required,
            selEnable: true,
            remote: x.remote,
            selectOptions: x.selectOptions || [],
            related: x.related
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
      },

      axiosMethod(text) {
        const methodText = text.toLowerCase()
        let method = axios.get
        switch (methodText) {
          case 'post':
            method = axios.post
            break
          case 'put':
            method = axios.put
            break
          case 'delete':
            method = axios.delete
            break
          case 'patch':
            method = axios.patch
            break
          default:
            break
        }
        return method
      }
    }
  }
</script>

<style scoped>

</style>
