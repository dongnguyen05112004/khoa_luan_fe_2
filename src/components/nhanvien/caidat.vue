<template>
    <div class="container mt-4">
        <h2 class="mb-4">Cài đặt về viên</h2>
        <div class="row">
            <div class="col-md-6">
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">Cài đặt về viên</h5>
                        <form @submit.prevent="saveSettings">
                            <div class="mb-3">
                                <label for="gymName" class="form-label">Tên phòng gym</label>
                                <input type="text" class="form-control" id="gymName" v-model="settings.gymName" required>
                            </div>
                            <div class="mb-3">
                                <label for="gymAddress" class="form-label">Địa chỉ</label>
                                <input type="text" class="form-control" id="gymAddress" v-model="settings.gymAddress" required>
                            </div>
                            <div class="mb-3">
                                <label for="gymPhone" class="form-label">Số điện thoại</label>
                                <input type="text" class="form-control" id="gymPhone" v-model="settings.gymPhone" required>
                            </div>
                            <div class="mb-3">
                                <label for="gymEmail" class="form-label">Email</label>
                                <input type="email" class="form-control" id="gymEmail" v-model="settings.gymEmail" required>
                            </div>
                            <div class="mb-3">
                                <label for="gymLogo" class="form-label">Logo</label>
                                <input type="file" class="form-control" id="gymLogo" @change="onFileChange">
                            </div>
                            <button type="submit" class="btn btn-primary">Lưu cài đặt</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CaiDat',
    data() {
        return {
            settings: {
                gymName: '',
                gymAddress: '',
                gymPhone: '',
                gymEmail: '',
                gymLogo: ''
            }
        }
    },
    methods: {
        onFileChange(e) {
            const file = e.target.files[0]
            this.settings.gymLogo = file
        },
        saveSettings() {
            console.log(this.settings)
        }
    }
}
</script>   