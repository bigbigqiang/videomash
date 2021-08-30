export default {
    data() {
        return {
            pageData: [],
            pagination: {
                pageIndex: 0,
                pageSize: 25,
                total: 0
            }
        }
    },
    computed: {
        currentPage: {
            get() {
                return this.pagination.pageIndex + 1
            },
            set(val) {
                this.pagination.pageIndex = val - 1
            }
        }
    },
    methods: {
        pageQuery(query = {}) {
            const { pageIndex, pageSize } = this.pagination
            return {
                ...query,
                pageIndex,
                pageSize
            }
        },
        resolvePageData(res) {
            if (!res) return
            this.pageData = res.data
            this.pagination = res.pagination
        },
        resetPage() {
            this.currentPage = 1
        },
        addDataItem(item) {
            this.pageData.push(item)
            this.addPageTotal(1)
        },
        removeDataItem(id, key = 'id') {
            this.pageData = this.pageData.filter(item => item[key] !== id)
            this.addPageTotal(-1)
        },
        setPageTotal(value) {
            this.pagination.total = value
        },
        addPageTotal(num) {
            this.pagination.total += num
        },
    }
}
