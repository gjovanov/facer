<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <v-card>
        <v-card-title class="headline">
          Realtime Face Recognition using TensorFlowJS and face-api-js
        </v-card-title>
        <v-responsive>
          <v-list two-line subheader>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Register</v-list-item-title>
                <v-list-item-subtitle>Register your name</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider />
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Take Photos</v-list-item-title>
                <v-list-item-subtitle>Upload photos either by the File Upload or using your Camera</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider />
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Train</v-list-item-title>
                <v-list-item-subtitle>Train the model for all users in the catalog</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider />
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Recognize</v-list-item-title>
                <v-list-item-subtitle>Recognize your face using browser camera</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-responsive>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            nuxt
            to="/users"
          >
            Register
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>

export default {

}
</script>
