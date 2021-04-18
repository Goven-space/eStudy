<template>
    <div>
        <a-table
            :rowKey="teacherAssignments=> teacherAssignments.assignment_id" 
            :columns="columns" 
            :dataSource="teacherAssignments" 
            :pagination="false">
            <template slot="operation" slot-scope="text,record">
                <div v-if="record.work_count > 0">
                    <a-button v-if="!revisingAssignment" icon="plus-square" type="primary" @click="revisingAssignment=record">展开</a-button>
                    <a-button v-else icon="minus-square" type="primary" @click="revisingAssignment=false">收回</a-button>
                    <a :href="`${downloadHost}All?id=${record.assignment_id}`">
                        <a-button icon="download" >下载全部</a-button>
                    </a>
                </div>
                <div v-else>
                    <a-popconfirm title="确定删除该作业?" @confirm="removeAssignment(record.assignment_id)" okText="确定" cancelText="取消">
                        <a-button icon="delete" type="danger">删除</a-button>
                    </a-popconfirm>                   
                </div>
            </template>               
        </a-table>
        <a-table 
            v-if="revisingAssignment" 
            :columns="workColumns" 
            :dataSource="revisingAssignment.works" 
            :rowKey="work=> work.id">
            <template slot="operation" slot-scope='text,record'>
                <a :href="`${downloadHost}?id=${record.id}&type=student`">
                    <a-button icon="download">下载</a-button>
                </a>
                <a-button icon='form' type="primary" @click="checkAssignment = record;checkForm.review = record.teacher_review">批改</a-button>
            </template>
        </a-table>
        <a-modal :visible="Boolean(checkAssignment)" @cancel="checkAssignment = false" :footer="null">
            <a-form>
                <a-form-item label='状态' :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
                    <a-select v-model="checkForm.status">
                        <a-select-option 
                            :key= "`status_${index}`" 
                            v-for="(status,index) in work_status" 
                            :value= 'index'> {{ status }} </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label='批改意见' :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
                    <a-textarea v-model="checkForm.review" autosize></a-textarea>
                </a-form-item>
                <a-form-item label="附件" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
                    <a-upload  
                        :action="teacherUploadHost" 
                        :headers="{Token:info.token}"
                        :data="{id:checkAssignment.id}">
                        <a-button icon="upload">上传</a-button>
                    </a-upload>
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 16 ,offset:5}">
                    <a-button type="primary" @click="saveCheck">保存</a-button>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>
<script>
import {mapState,mapMutations} from 'vuex'
import {api} from '../utils/api'

const baseHost = 'http://sandbox_api.estudy.chanke.xyz';
const work_status = {
                '0' : '待批改',
                '1' : '需完善',
                '2' : '已完成'
            };

export default {
    data(){
        return {
            downloadHost : baseHost + '/teacher/download',
            teacherUploadHost : baseHost + '/teacher/upload' ,
            reviewHost : baseHost + "/teacher/review",
            revisingAssignment : false,
            checkAssignment : false,
            work_status,
            checkForm : {
                status : '1',
                review : ""
            },
            workColumns : [{
                title : '学员名字',
                dataIndex : 'user.full_name'
            },{
               title : '学号',
               dataIndex : 'user.name' 
            },{
                title : '提交作业名称',
                dataIndex : 'student_upload_name'
            },{
                title : '提交时间',
                dataIndex : 'commit_time'
            },{
                title : '状态',
                customRender(text,record){
                    return work_status[record.status]
                }
            },{
                title : '操作',
                scopedSlots : {
                    customRender : 'operation'
                }
            }]
        }    
    },
    computed:{
        ...mapState('teacher',['teacherAssignments']),
        ...mapState('user',['info']),
        columns(){
            return [{
                title : '课程',
                dataIndex : 'org_name'
            },
            {
                title : '作业名称',
                dataIndex : 'name'
            },
            {
                title : '开始-截止时间',
                customRender(text,record){
                    return `${record.start_time}-${record.end_time}`
                }
            },
            {
                title : '状态',
                customRender(text,record){
                    return `${record.student_count} 个学员/ ${record.work_count} 个提交` + 
                        (record.work_count>0 ? ` - ${record.work_update_time}` : '')
                }
            },
            {
                title : '操作',
                scopedSlots:{
                    customRender : 'operation'
                },
                key : 'operation',
                filteredValue : this.revisingAssignment ? [this.revisingAssignment.assignment_id] : null,
                onFilter(value,record){
                    return value == record.assignment_id
                }
            }]
        }
        
    },
    methods:{
        removeAssignment(id){
            api.post('/teacher/deleteAssignment',{id}).then(data => {
                this.delAssignment(id)
                this.$message.info('删除成功');
            })
        },
        downloadAll(id){
            api.get('/teacher/downloadAll',{id}).then(data => {
                this.$message.info('正在下载')
            })
        },
        saveCheck(){
            this.checkForm.id = this.checkAssignment.id;
            api.post(this.reviewHost,this.checkForm).then(data => {
                Object.entries(data).forEach(item => this.$set(this.checkAssignment,item[0],item[1]))
            }).finally(() => {
                this.checkAssignment = false
            })
        },
        ...mapMutations('teacher',['delAssignment'])
    }
    
}
</script>
<style lang="scss" scoped>

</style>