import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles for the Web Crawl Report PDF
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FAFAFA',
        padding: 40,
        fontFamily: 'Helvetica',
        lineHeight: 1.4
    },

    // Header Section
    header: {
        flexDirection: 'row',
        marginBottom: 30,
        paddingBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#667EEA',
        alignItems: 'center',
    },
    
    headerLeft: {
        flex: 1
    },
    
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2D3748',
        marginBottom: 6,
    },
    
    subtitle: {
        fontSize: 14,
        color: '#718096',
        marginBottom: 8,
    },
    
    url: {
        fontSize: 12,
        color: '#667EEA',
        fontWeight: 'bold',
    },
    
    headerRight: {
        alignItems: 'flex-end',
    },
    
    date: {
        fontSize: 11,
        color: '#4A5568',
        marginBottom: 2,
    },

    // Statistics Container
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        paddingVertical: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        paddingHorizontal: 20,
    },
    
    statBox: {
        alignItems: 'center',
        flex: 1,
    },
    
    statNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2B6CB0',
        marginBottom: 6,
    },
    
    statLabel: {
        fontSize: 11,
        color: '#718096',
        textAlign: 'center',
        lineHeight: 1.2,
    },

    // Key Insights Section
    insightsContainer: {
        backgroundColor: '#EDF7ED',
        padding: 18,
        borderRadius: 8,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#48BB78'
    },
    
    insightsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2F855A',
        marginBottom: 10
    },
    
    insightItem: {
        flexDirection: 'row',
        marginBottom: 6,
        alignItems: 'flex-start'
    },
    
    insightBullet: {
        fontSize: 12,
        color: '#48BB78',
        marginRight: 6,
        marginTop: 1
    },
    
    insightText: {
        fontSize: 11,
        color: '#2F855A',
        flex: 1,
        lineHeight: 1.3
    },

    // Highlight Box
    highlightBox: {
        backgroundColor: '#FFF5F5',
        padding: 18,
        borderRadius: 8,
        marginBottom: 25,
        borderLeftWidth: 4,
        borderLeftColor: '#F56565',
    },
    
    highlightTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#C53030',
        marginBottom: 6
    },
    
    highlightText: {
        fontSize: 11,
        color: '#744210',
        lineHeight: 1.4
    },

    // Section Title
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2D3748',
        marginBottom: 15,
        marginTop: 10,
    },

    // Table Styles
    tableContainer: {
        marginBottom: 30,
        backgroundColor: '#FFFFFF',
        borderRadius: 6,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0'
    },
    
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#667EEA',
        paddingVertical: 12,
        paddingHorizontal: 15
    },
    
    tableHeaderText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textTransform: 'uppercase',
    },
    
    headerURL: {
        flex: 4,
    },
    
    headerStatus: {
        flex: 1,
        textAlign: 'center',
    },
    
    headerHits: {
        flex: 1,
        textAlign: 'center',
    },
    
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        alignItems: 'center'
    },
    
    cellURL: {
        fontSize: 10,
        color: '#4A5568',
        flex: 4,
        paddingRight: 10
    },
    
    cellStatus: {
        fontSize: 10,
        color: '#2B6CB0',
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    
    cellHits: {
        fontSize: 10,
        color: '#2B6CB0',
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold'
    },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        color: '#A0AEC0',
        fontSize: 9,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        paddingTop: 15,
    }
});

// PDF Document Component
const CrawlReportPDF = ({ data }) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Calculate statistics
    const totalLinks = data.links ? data.links.length : 0;
    const totalHits = data.links ? data.links.reduce((sum, link) => sum + link.hits, 0) : 0;
    const mostVisitedLink = data.links && data.links.length > 0 
        ? data.links.reduce((max, link) => link.hits > max.hits ? link : max, data.links[0])
        : null;
    const mostVisitedHits = mostVisitedLink ? mostVisitedLink.hits : 0;
    const topPageTrafficShare = totalHits > 0 ? Math.round((mostVisitedHits / totalHits) * 100) : 0;
    
    // Calculate successful links (status 200)
    const successfulLinks = data.links ? data.links.filter(link => link.status === 200).length : 0;
    const avgHitsPerLink = totalLinks > 0 ? Math.round(totalHits / totalLinks) : 0;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.title}>Web Crawl Report</Text>
                        <Text style={styles.subtitle}>Comprehensive Website Analysis & Link Discovery</Text>
                        <Text style={styles.url}>{data.url || 'N/A'}</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <Text style={styles.date}> {currentDate}</Text>
                        <Text style={styles.date}> {currentTime}</Text>
                    </View>
                </View>

                {/* Statistics Overview */}
                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>{totalLinks}</Text>
                        <Text style={styles.statLabel}>Links{'\n'}Discovered</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>{totalHits}</Text>
                        <Text style={styles.statLabel}>Total{'\n'}References</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>{topPageTrafficShare}%</Text>
                        <Text style={styles.statLabel}>Top Page{'\n'}Traffic Share</Text>
                    </View>
                </View>

                {/* Key Insights */}
                <View style={styles.insightsContainer}>
                    <Text style={styles.insightsTitle}>Key Insights</Text>
                    <View style={styles.insightItem}>
                        <Text style={styles.insightBullet}>•</Text>
                        <Text style={styles.insightText}>
                            {successfulLinks} out of {totalLinks} links ({totalLinks > 0 ? Math.round((successfulLinks / totalLinks) * 100) : 0}%) are functioning properly
                        </Text>
                    </View>
                    <View style={styles.insightItem}>
                        <Text style={styles.insightBullet}>•</Text>
                        <Text style={styles.insightText}>
                            Average of {avgHitsPerLink} references per discovered link
                        </Text>
                    </View>
                </View>

                {/* Most Popular Destination */}
                {mostVisitedLink && (
                    <View style={styles.highlightBox}>
                        <Text style={styles.highlightTitle}>Most Popular Destination</Text>
                        <Text style={styles.highlightText}>
                            {mostVisitedLink.url} leads the traffic with {mostVisitedHits} references, 
                            representing {topPageTrafficShare}% of all discovered links.
                        </Text>
                    </View>
                )}

                {/* Detailed Link Analysis Table */}
                <Text style={styles.sectionTitle}>Detailed Link Analysis</Text>
                <View style={styles.tableContainer}>
                    {/* Table Header */}
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderText, styles.headerURL]}>URL</Text>
                        <Text style={[styles.tableHeaderText, styles.headerStatus]}>STATUS</Text>
                        <Text style={[styles.tableHeaderText, styles.headerHits]}>HITS</Text>
                    </View>

                    {/* Table Rows */}
                    {data.links && data.links.map((link, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={styles.cellURL}>{link.url}</Text>
                            <Text style={styles.cellStatus}>{link.status}</Text>
                            <Text style={styles.cellHits}>{link.hits}</Text>
                        </View>
                    ))}
                </View>

                {/* Footer */}
                <Text style={styles.footer}>
                    Web-Crawler Analytics Dashboard • 
                    Generated from {totalLinks} discovered links across {totalHits} total references • 
                    Report compiled automatically for enhanced website analysis
                </Text>
            </Page>
        </Document>
    );
};

export default CrawlReportPDF;