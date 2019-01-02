<template>
  <v-layout
    column
    justify-center
    align-center>
    <v-flex
      xs12
      sm8
      md6>
      <v-card>
        <v-card-title class="headline">Realtime Face Recognition using TensorFlowJS and face-api-js</v-card-title>
        <v-responsive>
          <v-list two-line subheader>
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>Register</v-list-tile-title>
                <v-list-tile-sub-title>Register your name</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider />
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>Take Photos</v-list-tile-title>
                <v-list-tile-sub-title>Upload photos either by the File Upload or using your Camera</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider />
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>Train</v-list-tile-title>
                <v-list-tile-sub-title>Train the model for all users in the catalog</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider />
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>Recognize</v-list-tile-title>
                <v-list-tile-sub-title>Recognize your face using browser camera</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-responsive>
        <v-card-actions>
          <v-spacer/>
          <v-btn
            color="primary"
            nuxt
            to="/users">Register</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>

export default {

}
</script>
