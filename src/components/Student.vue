<template>
    <div>
        <a-table 
            :rowKey="studentAssignments=> studentAssignments.assignment_id" 
            :columns="columns" 
            :dataSource="studentAssignments"
            :pagination="false">
            <template slot='operation' slot-scope="text,record">
                <a-upload 
                    name="file" 
                    :action="uploadHost" 
                    :headers="{Token:info.token}" 
                    :data="{id: record.assignment_id}"
                    :showUploadList = "false"
                    @change="changeUpload">
                    <a-button icon="upload">上传</a-button>
                </a-upload>
                <a v-if="record.work" :href="`${downloadHost}?id=${record.work.id}&type=student`">
                    <a-button icon="download">下载</a-button>
                </a>
            </template>
            <template slot="info" slot-scope="text,record">
                <div v-if="record.work.status == 0">
                    {{record.work.teacher_download_time.slice(0,10) == '0000-00-00' ? `${record.work.commit_time} 提交` : `${record.work.teacher_download_time} 老师已下载` }}
                </div>
                <div v-else-if="record.work.status == 1">
                    <p>{{`${record.work.review_time} 老师提交修改意见`}}</p>
                    <a-button @click="visible = record.work">查看详情</a-button>
                </div>
                <div v-else>
                    <p>{{`${record.work.review_time} 老师完成批改`}}</p>
                    <a-button @click="visible = record.work">查看详情</a-button>
                </div>
            </template>
        </a-table>
        <!-- 对话框  -->
        <a-modal 
            :visible="Boolean(visible)" 
            @cancel="visible = false"
            title="批改意见">
            <p v-if="visible && visible.teacher_review">{{visible.teacher_review}}</p>
            <a v-if="visible &&visible.teacher_upload_name" :href="`${downloadHost}?id=${visible.id}&type=teacher`">
                <a-button icon="paper-clip">附件</a-button>
            </a>
            <template slot="footer">
                <a-button type="primary" @click="visible = false">明白了</a-button>
            </template>
        </a-modal>
    </div>
</template>
<script>
import {mapState} from 'vuex'

const work_status = {
    '0' : '待批改',
    '1' : '需完善',
    '2' : '已完成'
}
const baseHost = "http://localhost:3000"

export default {
    computed:{
        ...mapState('student',['studentAssignments']),
        ...mapState('user',['info'])
    },
    data(){
        return {
            visible : false,
            uploadHost : baseHost + "/student/upload",
            downloadHost : baseHost + '/student/download',

            columns:[{
                title: '课程',
                dataIndex: 'org_name'
            },
            {
                title: '作业名称',
                dataIndex: 'name'
            },
            {
                title: '开始-截至的时间',
                customRender(text,record){
                    return `${record.start_time}~${record.end_time}`
                }
            },
            {
                title:'操作',
                scopedSlots:{
                    customRender:'operation'
                }
            },
            {
                title:'状态',
                customRender(text,record){
                    return record.work? work_status[record.work.status] : '未提交' 
                }
            },
            {
                title:'信息',
                scopedSlots:{
                    customRender:'info'
                }
            }]
        }
    },
    methods:{
        changeUpload(info){
            if (info.file.status === 'done' && info.file.response.data) {
                //message全局提示（ant design）
                this.$message.info('上传成功')
            }else if(info.file.status === 'error'){
                //notification通知提醒框(ant design)
                this.$notification.error({
                    message:'上传失败',
                    description: info.file.response.errorMessage
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>