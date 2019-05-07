<template>
  <div>
    <Card title="设置" :padding="10" shadow>
          <CellGroup>
              <Cell title="就诊数据同步" to="/setting/full_sync"/>
              <Cell title="Display label content" label="label content" />
              <Cell title="Display right content" extra="details" />
              <Cell title="Link" extra="details" to="/components/button" />
              <Cell title="Open link in new window" to="/components/button" target="_blank" />
              <Cell title="Disabled" disabled />
              <Cell title="Selected" selected />
          </CellGroup>
      </Card>
  </div>
</template>

<script>
export default {
  name: 'setting'
}
</script>

