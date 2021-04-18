
const state = {
    teacherAssignments : [],
    teacherOrgs :[]
}
const mutations = {
    updataTeacher(state,data){
        state.teacherAssignments = data.assignments
        state.teacherOrgs = data.orgs
    },
    addAssignment(state,data){
        const org = state.teacherOrgs.find(org => org.id == data.org_id);
        data.student_count = org.student_count;
        state.teacherAssignments.unshift(data);
    },
    delAssignment(state,data){
        const index = state.teacherAssignments.findIndex(assignment => assignment.assignment_id == data);
        state.teacherAssignments.splice(index,1);
    }
}

export default {
    namespaced : true,
    state,
    mutations,
}