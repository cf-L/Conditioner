<template>
  <div>
    <el-button type="text" @click="dialogVisible = true">筛选</el-button>

    <el-dialog
      title="筛选"
      :visible.sync="dialogVisible"
      width="50%">

      <el-form>

        <el-form-item size="small" v-for="(option, index) in displayEl">

          <el-input clearable placeholder="请输入内容" v-model="option.value">

            <el-select
              slot="prepend"
              v-model="option.alias"
              style="width: 100px;"
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

            <el-select placeholder="包含" slot="prepend" v-model="option.sopt" style="width: 100px; margin-left: 1px;">
              <el-option
                v-for="(s, i) in option.soptObjs"
                :key="s.sopt"
                :value="s.sopt"
                :label="s.name">
              </el-option>
            </el-select>

            <el-button
              slot="append"
              icon="el-icon-close"
              v-if="option.required == false"
              :id="'conditionRemove-' + index"
              @click="removeAction($event)">
            </el-button>

          </el-input>

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
        nameSelIndex: -1
      }
    },
    created() {
      this.displayEl = this.requiredEl()
    },
    methods: {
      okAction() {
        if (!this.check()) {
          this.$message.error('需要填写完整条件，每行后面没带"x"为必填内容')
          return
        }
        this.dialogVisible = false
        this.displayEl = this.finalEl()
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
          console.log(model.type)
          el.type = model.type
          el.required = model.required
          el.soptObjs = this.soptObject(model.sopt)
          el.sopt = ''
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
          console.log(soptObjs)
          return {
            alias: firstAlias,
            type: '',
            soptObjs: soptObjs,
            sopt: soptObjs[0] ? soptObjs[0].sopt : '',
            value: '',
            required: firstModel.required
          }
        }
        return {}
      },
      requiredEl() {
        const _this = this
        const model = this.options.model.filter(x => x.required)
        const els = model.map(x => {
          const soptObjs = _this.soptObject(x.sopt)
          return {
            alias: x.alias,
            type: x.type,
            soptObjs: soptObjs,
            sopt: soptObjs[0] ? soptObjs[0] : '',
            value: '',
            required: x.required
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
