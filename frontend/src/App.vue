<template>
  <div style="max-width: 800px; margin: 2rem auto; font-family: sans-serif;">
    <h1>Notes XOR Crypto CRUD</h1>

    <form @submit.prevent="onSubmit" style="margin-bottom: 2rem;">
      <div style="margin-bottom: 0.5rem;">
        <label>Title</label><br />
        <input v-model="form.title" type="text" style="width: 100%; padding: 4px;" />
      </div>

      <div style="margin-bottom: 0.5rem;">
        <label>Content</label><br />
        <textarea
          v-model="form.content"
          rows="4"
          style="width: 100%; padding: 4px;"
        ></textarea>
      </div>

      <button type="submit">
        {{ form.id ? 'Update' : 'Create' }}
      </button>

      <button
        v-if="form.id"
        type="button"
        @click="resetForm"
        style="margin-left: 0.5rem;"
      >
        Cancel
      </button>
    </form>

    <h2>List Notes</h2>
    <table border="1" cellpadding="8" cellspacing="0" width="100%">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Content (Decrypted)</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="note in notes" :key="note.id">
          <td>{{ note.id }}</td>
          <td>{{ note.title }}</td>
          <td>{{ note.content }}</td>
          <td>
            <button @click="editNote(note)">Edit</button>
            <button @click="deleteNote(note.id)" style="margin-left: 0.5rem;">
              Delete
            </button>
          </td>
        </tr>
        <tr v-if="notes.length === 0">
          <td colspan="4" style="text-align: center;">No data</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Note {
  id: number
  title: string
  content: string
}

const API_BASE = 'http://localhost:3000'

const notes = ref<Note[]>([])
const form = ref<Partial<Note>>({
  id: undefined,
  title: '',
  content: '',
})

async function fetchNotes() {
  const res = await axios.get<Note[]>(`${API_BASE}/notes`)
  notes.value = res.data
}

</script>
