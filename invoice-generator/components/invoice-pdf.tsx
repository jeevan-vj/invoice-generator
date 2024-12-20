import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { InvoiceData } from "../types/invoice"
import { calculateSubtotal, calculateTax, formatCurrency } from "../utils/calculations"

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  column: {
    flex: 1,
  },
  label: {
    color: '#666',
    marginBottom: 4,
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  description: { flex: 2 },
  quantity: { flex: 1 },
  price: { flex: 1 },
  total: { flex: 1 },
  totals: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 8,
  },
})

export function InvoicePDF({ data }: { data: InvoiceData }) {
  const subtotal = calculateSubtotal(data.items)
  const tax = calculateTax(subtotal, data.taxRate)
  const total = subtotal + tax

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Invoice #{data.invoiceNumber}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>From:</Text>
              <Text>{`${data.sender.firstName} ${data.sender.lastName}`}</Text>
              {data.sender.companyName && <Text>{data.sender.companyName}</Text>}
              <Text>{data.sender.email}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>To:</Text>
              <Text>{`${data.client.firstName} ${data.client.lastName}`}</Text>
              {data.client.companyName && <Text>{data.client.companyName}</Text>}
              <Text>{data.client.email}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Issue Date:</Text>
              <Text>{data.issueDate}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Due Date:</Text>
              <Text>{data.dueDate}</Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.description}>Description</Text>
            <Text style={styles.quantity}>Quantity</Text>
            <Text style={styles.price}>Price</Text>
            <Text style={styles.total}>Total</Text>
          </View>
          {data.items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <Text style={styles.price}>{formatCurrency(item.price)}</Text>
              <Text style={styles.total}>{formatCurrency(item.quantity * item.price)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.row}>
            <Text style={styles.column}>Subtotal</Text>
            <Text style={styles.column}>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.column}>Tax ({data.taxRate}%)</Text>
            <Text style={styles.column}>{formatCurrency(tax)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.column, { fontWeight: 'bold' }]}>Total</Text>
            <Text style={[styles.column, { fontWeight: 'bold' }]}>{formatCurrency(total)}</Text>
          </View>
        </View>

        {data.memo && (
          <View style={[styles.section, { marginTop: 40 }]}>
            <Text style={styles.label}>Notes:</Text>
            <Text>{data.memo}</Text>
          </View>
        )}
      </Page>
    </Document>
  )
}

