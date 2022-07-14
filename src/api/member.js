import request from '@/utils/request'

export default {
    //获取会员列表数据
    getList(){
      return  request({
            url: '/member/list',
            method: 'get'
        })
    },


    //分页搜索方法
    /**
     *
     * @param page  当前页码 要查询哪一页
     * @param size 页面查询条数
     * @param searchMap 条件查询的条件值
     */
    search(page, size, searchMap){
        return request({
            url: `/member/list/search/${page}/${size}`,
            method: 'post',
            data: {
                // 条件查询的数据
                searchMap
            }
        })
    },

    //新增会员
    add(pojo){
        return request({
            url: '/member',
            method: 'post',
            data: {
                pojo
            }
        })
    },

    //通过id查询会员信息
    getById(id){
        return request({
            url: `/member/${id}`,
            method: 'get',

        })
    },

    //更新数据
    update(pojo){
        return request({
            url: `/member/${pojo.id}`,
            method: 'put',
            data: pojo
        })
    },

    //删除会员
    deleteById(id){
        return request({
            url: `/member/${id}`,
            method: 'delete'
        })
    }

}
