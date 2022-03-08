<template>
  <v-container fluid class="px-16">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title class="headline"> ページリスト </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item-group>
                <v-list-item
                  v-for="page in pages"
                  :key="page.title"
                  nuxt
                  :to="page.to"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ page.title }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" nuxt to="/inspire"> Continue </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent, useMeta } from '@nuxtjs/composition-api';
export default defineComponent({
  name: 'IndexPage',
  setup() {
    // meta
    const { title } = useMeta();
    title.value = 'Top';

    // indexページから遷移するためのリンク
    const pages = [
      {
        title: '大会',
        to: { name: 'contests' },
      },
    ];
    return { pages };
  },
  head: {},
});
</script>
