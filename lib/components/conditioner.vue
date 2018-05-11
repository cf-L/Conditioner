<template>
  <div>
    <el-button type="text" @click="dialogVisible = true">筛选</el-button>

    <el-dialog
      title="筛选"
      :visible.sync="dialogVisible"
      width="50%">

      <el-form>

        <el-form-item size="small">
          <el-row type="flex" justify="end">
            <el-button type="text">添加</el-button>
          </el-row>
        </el-form-item>

        <el-form-item size="small">
          <el-input clearable placeholder="请输入内容">

            <template slot="prepend">标题</template>
            <el-select placeholder="包含" slot="prepend"  style="width: 100px; margin-left: 1px;">
              <el-option label="包含" value="1"></el-option>
              <el-option label="不包含" value="2"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-close"></el-button>
          </el-input>
        </el-form-item>

      </el-form>


      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="okAction">确 定</el-button>
      </span>

    </el-dialog>
  </div>

</template>

<script>
  export default {
    name: 'conditioner',
    props: {
      options: Object
    },
    data() {
      return {
        dialogVisible: false
      }
    },
    methods: {
      okAction() {
        this.dialogVisible = false
        console.log(this.options)
      }
    }
  }
</script>

<style scoped>

</style>
