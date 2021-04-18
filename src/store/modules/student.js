
const state = {
    studentOrgs : [],
    stats : {},
    studentAssignments : []
}

const mutations = {
    updataStudent(state,data){
        state.studentAssignments = data.assignments
        state.studentOrgs = data.orgs
        state.stats = data.stats
    }
}
const getters = {

}

export default {
    //设置独立的命名空间
    namespaced:true,
    state,
    getters,
    mutations
}