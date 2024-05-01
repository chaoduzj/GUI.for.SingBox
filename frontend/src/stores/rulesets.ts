import { ref } from 'vue'
import { defineStore } from 'pinia'
import { stringify, parse } from 'yaml'

import { Readfile, Writefile, Copyfile, Download, FileExists } from '@/bridge'
import { RulesetsFilePath, RulesetFormat, EmptyRuleSet } from '@/constant'
import { deepClone, debounce, ignoredError, omitArray } from '@/utils'

export type RuleSetType = {
  id: string
  tag: string
  updateTime: string
  disabled: boolean
  type: 'Http' | 'File' | 'Manual'
  format: RulesetFormat
  path: string
  url: string
  // Not Config
  updating?: boolean
}

export const useRulesetsStore = defineStore('rulesets', () => {
  const rulesets = ref<RuleSetType[]>([])

  const setupRulesets = async () => {
    const data = await ignoredError(Readfile, RulesetsFilePath)
    data && (rulesets.value = parse(data))
  }

  const saveRulesets = debounce(async () => {
    const r = omitArray(rulesets.value, ['updating'])
    await Writefile(RulesetsFilePath, stringify(r))
  }, 500)

  const addRuleset = async (r: RuleSetType) => {
    rulesets.value.push(r)
    try {
      await saveRulesets()
    } catch (error) {
      rulesets.value.pop()
      throw error
    }
  }

  const deleteRuleset = async (id: string) => {
    const idx = rulesets.value.findIndex((v) => v.id === id)
    if (idx === -1) return
    const backup = rulesets.value.splice(idx, 1)[0]
    try {
      await saveRulesets()
    } catch (error) {
      rulesets.value.splice(idx, 0, backup)
      throw error
    }
  }

  const editRuleset = async (id: string, r: RuleSetType) => {
    const idx = rulesets.value.findIndex((v) => v.id === id)
    if (idx === -1) return
    const backup = rulesets.value.splice(idx, 1, r)[0]
    try {
      await saveRulesets()
    } catch (error) {
      rulesets.value.splice(idx, 1, backup)
      throw error
    }
  }

  const _doUpdateRuleset = async (r: RuleSetType) => {
    if (r.type === 'Manual') {
      if (r.path.length == 0) {
        throw 'Ruleset file path is empty'
      }
      if (!(await FileExists(r.path))) {
        await Writefile(r.path, JSON.stringify(EmptyRuleSet, null, 2))
      }
    } else if (r.type === 'File') {
      const exists = r.url.length > 0 && (await FileExists(r.url))
      if (exists) {
        if (r.path != r.url) {
          await Copyfile(r.url, r.path)
        }
      } else if (r.path === r.url) {
        // create a default ruleset file
        await Writefile(r.path, JSON.stringify(EmptyRuleSet, null, 2))
      } else {
        throw 'Source ruleset file not exists ' + r.url
      }
    } else if (r.type === 'Http') {
      await Download(r.url, r.path)
      if (!(await FileExists(r.path))) {
        throw 'Ruleset file not downloaded ' + r.url
      }
    }

    r.updateTime = new Date().toLocaleString()
  }

  const updateRuleset = async (id: string) => {
    const r = rulesets.value.find((v) => v.id === id)
    if (!r) throw id + ' Not Found'
    if (r.disabled) throw r.tag + ' Disabled'
    try {
      r.updating = true
      await _doUpdateRuleset(r)
      await saveRulesets()
      return `Ruleset [${r.tag}] updated successfully.`
    } finally {
      r.updating = false
    }
  }

  const updateRulesets = async () => {
    let needSave = false
    for (let i = 0; i < rulesets.value.length; i++) {
      const r = rulesets.value[i]
      if (r.disabled) continue
      try {
        r.updating = true
        await _doUpdateRuleset(r)
        needSave = true
      } finally {
        r.updating = false
      }
    }
    if (needSave) saveRulesets()
  }

  const getRulesetById = (id: string) => rulesets.value.find((v) => v.id === id)

  return {
    rulesets,
    setupRulesets,
    saveRulesets,
    addRuleset,
    editRuleset,
    deleteRuleset,
    updateRuleset,
    updateRulesets,
    getRulesetById
  }
})
